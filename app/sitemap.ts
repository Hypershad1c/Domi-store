import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { products } from "@/lib/data";
import { siteUrl } from "@/lib/utils";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> { const routes = ["/", "/boutique", "/comparatif", "/espace-pro", "/contact", "/service-apres-vente", "/mentions-legales", "/conditions-de-vente", "/politique-de-livraison"]; const base = routes.map((path) => ({ url: siteUrl(path) || path, lastModified: new Date() })); try { const dbProducts = await prisma.product.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }); const items = dbProducts.length ? dbProducts : products.map((product) => ({ slug: product.slug, updatedAt: new Date() })); return [...base, ...items.map((product) => ({ url: siteUrl(`/produit/${product.slug}`) || `/produit/${product.slug}`, lastModified: product.updatedAt }))]; } catch { return [...base, ...products.map((product) => ({ url: siteUrl(`/produit/${product.slug}`) || `/produit/${product.slug}`, lastModified: new Date() }))]; } }
