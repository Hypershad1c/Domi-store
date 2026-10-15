import type { MetadataRoute } from "next";
import { products } from "@/lib/data";
import { siteUrl } from "@/lib/utils";
export default function sitemap(): MetadataRoute.Sitemap { const routes = ["/", "/boutique", "/comparatif", "/espace-pro", "/contact", "/mentions-legales", "/conditions-de-vente", "/politique-de-livraison"]; return [...routes.map((path) => ({ url: siteUrl(path) || path, lastModified: new Date() })), ...products.map((p) => ({ url: siteUrl(`/produit/${p.slug}`) || `/produit/${p.slug}`, lastModified: new Date() }))]; }
