import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function getOrCreateCategory(name: string) {
  const normalizedName = name.trim();
  const existing = await prisma.category.findUnique({ where: { name: normalizedName } });
  if (existing) return existing;

  const baseSlug = slugify(normalizedName) || "category";
  let slug = baseSlug;
  let suffix = 2;
  while (await prisma.category.findUnique({ where: { slug }, select: { id: true } })) {
    slug = `${baseSlug}-${suffix++}`;
  }

  // Upsert by the unique name so older categories with legacy slugs are reused.
  return prisma.category.upsert({
    where: { name: normalizedName },
    update: {},
    create: { name: normalizedName, slug },
  });
}
