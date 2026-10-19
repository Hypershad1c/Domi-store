import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, ShieldCheck, Truck } from "lucide-react";
import { getPublicProduct } from "@/lib/catalog";
import { products } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { ProductActions } from "@/components/product-actions";
import { ProductGallery } from "@/components/product-gallery";

export const dynamic = "force-dynamic";
export function generateStaticParams() { return products.map((p) => ({ slug: p.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const product = await getPublicProduct(slug); return product ? { title: product.name, description: product.shortDesc } : { title: "Produit introuvable" }; }

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getPublicProduct(slug);
  if (!product) notFound();
  return <main><div className="container-page py-8"><Link href="/boutique" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-signal"><ArrowLeft size={16} /> Retour à la boutique</Link><div className="mt-8 grid gap-12 lg:grid-cols-[.95fr_1.05fr] lg:items-start"><ProductGallery images={product.images} name={product.name} /><div className="pt-2"><p className="eyebrow">Domi'Lock / {product.category}</p><h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-6xl">{product.name}</h1><p className="mt-5 text-lg leading-8 text-slate-500">{product.description}</p><div className="mt-7 flex flex-wrap items-end gap-4"><span className="text-3xl font-extrabold">{formatPrice(product.price)}</span>{product.compareAt && <del className="text-slate-400">{formatPrice(product.compareAt)}</del>}<span className="rounded-full bg-mint px-3 py-1 text-xs font-bold text-emerald-700">Stock disponible</span></div><div className="mt-8"><ProductActions product={product} /></div><div className="mt-8 grid gap-3 border-y border-line py-6 sm:grid-cols-2"><div className="flex gap-3"><Truck className="shrink-0 text-signal" size={20} /><div><p className="text-sm font-bold">Livraison & installation</p><p className="mt-1 text-xs leading-5 text-slate-500">Offertes partout où nous intervenons.</p></div></div><div className="flex gap-3"><ShieldCheck className="shrink-0 text-signal" size={20} /><div><p className="text-sm font-bold">Accompagnement domiStore</p><p className="mt-1 text-xs leading-5 text-slate-500">On reste disponibles après la pose.</p></div></div></div><div className="mt-8"><h2 className="text-xl font-extrabold">Caractéristiques</h2><ul className="mt-4 grid gap-3 sm:grid-cols-2">{product.features.map((feature) => <li key={feature} className="flex gap-2 text-sm leading-6 text-slate-600"><Check size={17} className="mt-1 shrink-0 text-signal" />{feature}</li>)}</ul></div></div></div></div></main>;
}
