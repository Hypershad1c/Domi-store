import { prisma } from "@/lib/prisma";
import { products, type Product } from "@/lib/data";
import { slugify } from "@/lib/utils";

function toPublicProduct(product: { id: string; name: string; slug: string; category: { name: string; slug: string }; price: number; compareAt: number | null; shortDesc: string; description: string; features: unknown; stock: number; published: boolean; featured: boolean; hasCamera: boolean; faceId: boolean; images: { url: string; sortOrder: number; isPrimary: boolean }[] }): Product {
  const orderedImages = [...product.images].sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary) || a.sortOrder - b.sortOrder).map((image) => image.url);
  const fallback = products.find((item) => item.slug === product.slug);
  return { id: product.id, name: product.name, slug: product.slug, category: product.category.name, categorySlug: product.category.slug, price: product.price, ...(product.compareAt ? { compareAt: product.compareAt } : {}), shortDesc: product.shortDesc, description: product.description, features: Array.isArray(product.features) ? product.features.filter((item): item is string => typeof item === "string") : fallback?.features || [], stock: product.stock, published: product.published, featured: product.featured, hasCamera: product.hasCamera, faceId: product.faceId, images: orderedImages.length ? orderedImages : fallback?.images || ["/product-lock.svg"] };
}

export async function getPublicProducts(): Promise<Product[]> {
  try {
    const data = await prisma.product.findMany({ where: { published: true }, include: { category: true, images: { orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }] } }, orderBy: { updatedAt: "desc" } });
    return data.length ? data.map(toPublicProduct) : products;
  } catch { return products; }
}

export async function getPublicProduct(slug: string): Promise<Product | undefined> {
  const normalizedSlug = slugify(slug);
  const fallback = products.find((item) => item.slug === slug || item.slug === normalizedSlug);
  try {
    const include = { category: true, images: { orderBy: [{ isPrimary: "desc" as const }, { sortOrder: "asc" as const }] } };
    const product = await prisma.product.findFirst({ where: { slug: normalizedSlug, published: true }, include })
      || await prisma.product.findFirst({ where: { slug, published: true }, include });
    if (product) return toPublicProduct(product);
    const legacyProducts = await prisma.product.findMany({ where: { published: true }, include });
    const legacyProduct = legacyProducts.find((item) => slugify(item.slug) === normalizedSlug);
    return legacyProduct ? toPublicProduct(legacyProduct) : fallback;
  } catch { return fallback; }
}
