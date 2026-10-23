"use client";

import Link from "next/link";
import { ArrowUpRight, Check, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/components/cart-provider";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { add, setOpen, lastAdded } = useCart();
  const badge = product.slug === "domy-x5-slim" ? "Nouveau" : product.faceId ? "Premium" : product.featured ? "Populaire" : product.category;
  const highlight = product.faceId ? "Reconnaissance faciale" : product.hasCamera ? "Caméra HD" : "Empreinte + Tuya";
  const justAdded = lastAdded === product.name;

  function addToCart() {
    add(product);
    setOpen(true);
  }

  return (
    <article className="group overflow-hidden rounded-2xl border border-line bg-white shadow-card transition duration-500 hover:-translate-y-2 hover:border-blue-200 hover:shadow-soft motion-safe:animate-card-enter" style={{ animationDelay: `${Math.min(index * 90, 360)}ms` }}>
      <Link href={`/produit/${product.slug}`} className="relative block overflow-hidden bg-cloud">
        <div className="absolute left-4 top-4 z-10 flex items-center gap-2">
          <span className="rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[.12em] text-signal shadow-sm backdrop-blur">{badge}</span>
          <span className="rounded-full bg-ink/85 px-2.5 py-1.5 text-[10px] font-bold text-white">0{index + 1}</span>
        </div>
        <img src={product.images[0]} alt={`Serrure intelligente ${product.name}`} className={`h-64 w-full object-cover transition duration-700 group-hover:scale-[1.05] ${product.images[1] ? "group-hover:opacity-0" : ""}`} />
        {product.images[1] && <img src={product.images[1]} alt={`${product.name} vue secondaire`} className="absolute inset-0 h-64 w-full object-cover opacity-0 transition duration-700 group-hover:scale-[1.05] group-hover:opacity-100" />}
        <span className="absolute bottom-4 right-4 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-bold text-slate-600 shadow-sm">{product.images.length} vue{product.images.length > 1 ? "s" : ""}</span>
      </Link>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div><Link href={`/produit/${product.slug}`} className="text-xl font-extrabold tracking-tight hover:text-signal">{product.name}</Link><p className="mt-1 text-sm leading-6 text-slate-500">{product.shortDesc}</p></div>
          <ArrowUpRight size={20} className="shrink-0 text-slate-300 transition duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-signal" />
        </div>
        <div className="mt-5 flex items-end justify-between gap-3">
          <div><span className="text-xl font-extrabold text-ink">{formatPrice(product.price)}</span><span className="ml-2 text-xs text-slate-400">installation incluse</span></div>
          <button onClick={addToCart} className="grid h-11 w-11 place-items-center rounded-xl bg-ink text-white transition duration-200 hover:-translate-y-1 hover:bg-signal active:scale-90" aria-label={justAdded ? `${product.name} ajouté au panier` : `Ajouter ${product.name} au panier`} aria-live="polite">
            {justAdded ? <Check size={18} className="animate-check-pop" /> : <ShoppingBag size={17} />}
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-xs"><span className="flex items-center gap-1 rounded-full bg-mint px-2.5 py-1 font-semibold text-emerald-700"><Check size={13} /> {highlight}</span><span className="rounded-full bg-cloud px-2.5 py-1 text-slate-600">{product.stock > 0 ? `${product.stock} en stock` : "Sur commande"}</span></div>
        <Link href={`/produit/${product.slug}`} className="mt-4 flex items-center justify-center rounded-xl border border-line px-3 py-2.5 text-sm font-bold text-ink transition duration-200 hover:-translate-y-0.5 hover:border-signal hover:bg-blue-50 hover:text-signal active:scale-[.98]">Voir le produit</Link>
      </div>
    </article>
  );
}
