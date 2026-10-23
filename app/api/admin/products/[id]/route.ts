import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdmin } from "@/lib/session";
import { productSchema } from "@/lib/validation";
import { notifyLowStock } from "@/lib/notifications";
import { lowStockThreshold } from "@/lib/inventory";

function categorySlug(name: string) { return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-"); }
function isDuplicateKey(error: unknown) { return typeof error === "object" && error !== null && "code" in error && error.code === "P2002"; }

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdmin())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  let body: unknown;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Le formulaire est illisible. Rechargez la page et réessayez." }, { status: 400 }); }
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({
    error: "Certaines informations du produit sont invalides.",
    details: parsed.error.issues.map((issue) => ({ field: issue.path.join(".") || "formulaire", message: issue.message })),
  }, { status: 400 });

  const { id } = await params;
  const { category: categoryName, imageUrl, imageUrls, primaryImageIndex, ...productData } = parsed.data;
  const urls = imageUrls.length ? imageUrls : imageUrl ? [imageUrl] : [];
  try {
    const category = await prisma.category.upsert({ where: { slug: categorySlug(categoryName) }, update: { name: categoryName }, create: { name: categoryName, slug: categorySlug(categoryName) } });
    const result = await prisma.$transaction(async (tx) => {
      const current = await tx.product.findUnique({ where: { id }, select: { stock: true } });
      if (!current) return null;
      const existingImages = await tx.productImage.findMany({ where: { productId: id }, select: { id: true, url: true } });
      const product = await tx.product.update({ where: { id }, data: { ...productData, categoryId: category.id, features: productData.features } });
      if (current.stock !== productData.stock) {
        await tx.inventoryMovement.create({ data: { productId: id, quantity: productData.stock - current.stock, stockBefore: current.stock, stockAfter: productData.stock, reason: "ADMIN_ADJUSTMENT" } });
      }
      const retainedIds: string[] = [];
      for (const [index, url] of urls.entries()) {
        const existing = existingImages.find((image) => image.url === url);
        const values = { alt: productData.name, sortOrder: index, isPrimary: index === Math.min(primaryImageIndex, urls.length - 1) };
        if (existing) {
          retainedIds.push(existing.id);
          await tx.productImage.update({ where: { id: existing.id }, data: values });
        } else {
          const created = await tx.productImage.create({ data: { productId: id, url, ...values } });
          retainedIds.push(created.id);
        }
      }
      await tx.productImage.deleteMany({ where: { productId: id, id: { notIn: retainedIds } } });
      return { product, stockBefore: current.stock };
    });

    if (!result) return NextResponse.json({ error: "Produit introuvable." }, { status: 404 });
    if (result.stockBefore > lowStockThreshold && result.product.stock <= lowStockThreshold) await notifyLowStock({ name: result.product.name, stock: result.product.stock, threshold: lowStockThreshold }).catch(() => undefined);
    const product = await prisma.product.findUnique({ where: { id }, include: { category: true, images: { select: { id: true, url: true, alt: true, sortOrder: true, isPrimary: true, contentType: true }, orderBy: { sortOrder: "asc" } } } });
    return NextResponse.json(product);
  } catch (error) {
    if (isDuplicateKey(error)) return NextResponse.json({ error: "Un produit avec ce slug existe déjà.", details: [{ field: "slug", message: "Choisissez un slug unique." }] }, { status: 409 });
    console.error("Admin product update failed", error);
    return NextResponse.json({ error: "La base de données n’a pas pu enregistrer ce produit.", details: [{ field: "serveur", message: error instanceof Error ? error.message : "Erreur inconnue." }] }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdmin())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;
  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin product delete failed", error);
    return NextResponse.json({ error: "Impossible de supprimer ce produit.", details: [{ field: "serveur", message: error instanceof Error ? error.message : "Erreur inconnue." }] }, { status: 500 });
  }
}