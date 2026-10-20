import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdmin } from "@/lib/session";
import { productSchema } from "@/lib/validation";
import { notifyLowStock } from "@/lib/notifications";
import { lowStockThreshold } from "@/lib/inventory";
function categorySlug(name: string) { return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-"); }
export async function GET() {
  if (!(await getAdmin())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const data = await prisma.product.findMany({ include: { category: true, images: { select: { id: true, url: true, alt: true, sortOrder: true, isPrimary: true, contentType: true } } }, orderBy: { updatedAt: "desc" } });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  if (!(await getAdmin())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const parsed = productSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  const { category: categoryName, imageUrl, imageUrls, primaryImageIndex, ...productData } = parsed.data;
  const urls = imageUrls.length ? imageUrls : imageUrl ? [imageUrl] : [];
  const category = await prisma.category.upsert({ where: { slug: categorySlug(categoryName) }, update: { name: categoryName }, create: { name: categoryName, slug: categorySlug(categoryName) } });
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
}
