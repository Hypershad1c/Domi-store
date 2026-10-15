import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdmin } from "@/lib/session";
import { productSchema } from "@/lib/validation";

function categorySlug(name: string) { return name.toLowerCase().replace(/[^a-z0-9]+/g, "-"); }

export async function GET() {
  if (!(await getAdmin())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const data = await prisma.product.findMany({ include: { category: true, images: true }, orderBy: { updatedAt: "desc" } });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  if (!(await getAdmin())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const parsed = productSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  const { category: categoryName, ...productData } = parsed.data;
  const category = await prisma.category.upsert({ where: { slug: categorySlug(categoryName) }, update: { name: categoryName }, create: { name: categoryName, slug: categorySlug(categoryName) } });
  const product = await prisma.product.create({ data: { ...productData, categoryId: category.id, features: productData.features } });
  return NextResponse.json(product, { status: 201 });
}
