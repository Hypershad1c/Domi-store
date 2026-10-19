import type { Metadata } from "next";
import { ProductBrowser } from "@/components/product-browser";
import { getPublicProducts } from "@/lib/catalog";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Boutique", description: "Comparez et choisissez votre serrure intelligente Domi'Lock." };
export default async function Boutique() { const products = await getPublicProducts(); return <main><section className="border-b border-line bg-cloud py-14 sm:py-20"><div className="container-page"><p className="eyebrow">Domi'Lock / Collection</p><h1 className="mt-3 max-w-2xl text-4xl font-extrabold tracking-tight sm:text-6xl">Le bon niveau d'accès. <span className="text-signal">Votre porte.</span></h1><p className="mt-5 max-w-xl text-lg leading-8 text-slate-500">Du modèle essentiel à la reconnaissance faciale, trouvez la serrure qui correspond à votre quotidien.</p></div></section><section className="container-page py-12 sm:py-16"><ProductBrowser products={products} /></section></main>; }
