import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdmin } from "@/lib/session";
import { productSchema } from "@/lib/validation";
import { notifyLowStock } from "@/lib/notifications";
import { lowStockThreshold } from "@/lib/inventory";
import { getOrCreateCategory } from "@/lib/categories";
import { runAuditedAdminAction } from "@/lib/admin-audit";
import { slugify } from "@/lib/utils";

function isDuplicateKey(error: unknown) { return typeof error === "object" && error !== null && "code" in error && error.code === "P2002"; }
function duplicateField(error: unknown) {
  if (typeof error !== "object" || error === null || !("meta" in error)) return "";
  const target = (error as { meta?: { target?: unknown } }).meta?.target;
  return Array.isArray(target) ? target.join(" ") : String(target || "");
}
function isProductSlugDuplicate(error: unknown) {
  if (!isDuplicateKey(error)) return false;
  const field = duplicateField(error).toLowerCase();
  return field.includes("product_slug") || field.trim() === "slug";
}

export async function GET() {
  if (!(await getAdmin())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const data = await prisma.product.findMany({ include: { category: true, images: { select: { id: true, url: true, alt: true, sortOrder: true, isPrimary: true, contentType: true } } }, orderBy: { updatedAt: "desc" } });
  return NextResponse.json(data);
}

async function createProductHandler(request: Request) {
  if (!(await getAdmin())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  let body: unknown;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Le formulaire est illisible. Rechargez la page et réessayez." }, { status: 400 }); }

  const parsed = productSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({
    error: "Certaines informations du produit sont invalides.",
    details: parsed.error.issues.map((issue) => ({ field: issue.path.join(".") || "formulaire", message: issue.message })),
  }, { status: 400 });

  const normalizedSlug = slugify(parsed.data.slug);
  if (normalizedSlug.length < 2) return NextResponse.json({ error: "Le slug doit contenir au moins deux caractères après normalisation.", details: [{ field: "slug", message: "Utilisez des lettres et des chiffres dans le slug." }] }, { status: 400 });
  const { category: categoryName, imageUrl, imageUrls, primaryImageIndex, ...productData } = parsed.data;
  productData.slug = normalizedSlug;
  const urls = imageUrls.length ? imageUrls : imageUrl ? [imageUrl] : [];
  try {
    const slugInUse = await prisma.product.findUnique({ where: { slug: productData.slug }, select: { id: true } });
    if (slugInUse) return NextResponse.json({ error: "Un produit avec ce slug existe déjà.", details: [{ field: "slug", message: "Choisissez un slug unique." }] }, { status: 409 });
    const category = await getOrCreateCategory(categoryName);
    const product = await prisma.product.create({
      data: {
        ...productData,
        categoryId: category.id,
        features: productData.features,
        images: urls.length ? { create: urls.map((url, index) => ({ url, alt: productData.name, sortOrder: index, isPrimary: index === Math.min(primaryImageIndex, urls.length - 1) })) } : undefined,
        inventoryMovements: productData.stock > 0 ? { create: { quantity: productData.stock, stockBefore: 0, stockAfter: productData.stock, reason: "INITIAL_STOCK" } } : undefined,
      },
      include: { category: true, images: { select: { id: true, url: true, alt: true, sortOrder: true, isPrimary: true, contentType: true }, orderBy: { sortOrder: "asc" } } },
    });
    if (product.stock <= lowStockThreshold) await notifyLowStock({ name: product.name, stock: product.stock, threshold: lowStockThreshold }).catch(() => undefined);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (isProductSlugDuplicate(error)) return NextResponse.json({ error: "Un produit avec ce slug existe déjà.", details: [{ field: "slug", message: "Choisissez un slug unique." }] }, { status: 409 });
    console.error("Admin product creation failed", error);
    return NextResponse.json({ error: "La base de données n’a pas pu créer ce produit.", details: [{ field: "serveur", message: error instanceof Error ? error.message : "Erreur inconnue." }] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  return runAuditedAdminAction({ request, admin, action: "CREATE", entityType: "Produit", run: () => createProductHandler(request) });
}
