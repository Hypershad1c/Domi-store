"use client";

import Link from "next/link";
import { ArrowUpRight, Check, ShoppingBag } from "lucide-react";
import { Button, Card } from "@heroui/react";
import { motion, useReducedMotion } from "motion/react";
import type { Product } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/components/cart-provider";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { add, setOpen, lastAdded } = useCart();
  const reduceMotion = useReducedMotion();
  const badge = product.slug === "domy-x5-slim" ? "Nouveau" : product.faceId ? "Premium" : product.featured ? "Populaire" : product.category;
  const highlight = product.faceId ? "Reconnaissance faciale" : product.hasCamera ? "Cam\u00e9ra HD" : "Empreinte + Tuya";
  const justAdded = lastAdded === product.name;
  const productUrl = `/produit/${encodeURIComponent(product.slug)}`;

  function addToCart() {
    add(product);
    setOpen(true);
  }

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      whileHover={reduceMotion ? undefined : { y: -7 }}
      whileTap={reduceMotion ? undefined : { scale: 0.99 }}
      transition={{ duration: 0.42, delay: Math.min(index * 0.07, 0.28), ease: "easeOut" }}
      className="h-full"
    >
      <Card role="article" className="group h-full gap-0 overflow-hidden rounded-2xl border border-line bg-white p-0 shadow-card transition-shadow duration-500 hover:border-blue-200 hover:shadow-soft">
        <Card.Content className="flex h-full flex-col gap-0 p-0">
          <Link href={productUrl} className="product-stage relative block overflow-hidden">
            <div className="absolute left-4 top-4 z-10 flex items-center gap-2">
              <span className={`rounded-full px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[.12em] shadow-sm backdrop-blur ${product.slug === "domy-x5-slim" ? "bg-accent text-ink" : "bg-white/90 text-signal"}`}>{badge}</span>
              <span className="rounded-full bg-ink/85 px-2.5 py-1.5 text-[10px] font-bold text-white">0{index + 1}</span>
            </div>
            <img src={product.images[0]} alt={`Serrure intelligente ${product.name}`} className={`h-[250px] w-full object-contain p-5 transition duration-700 group-hover:scale-[1.04] sm:h-[270px] ${product.images[1] ? "group-hover:opacity-0" : ""}`} />
            {product.images[1] && <img src={product.images[1]} alt={`${product.name} vue secondaire`} className="absolute inset-0 h-[250px] w-full object-contain p-5 opacity-0 transition duration-700 group-hover:scale-[1.04] group-hover:opacity-100 sm:h-[270px]" />}
            <span className="absolute bottom-3 right-3 rounded-full border border-white/80 bg-white/90 px-3 py-1.5 text-[10px] font-bold text-slate-600 shadow-sm backdrop-blur">{product.images.length} vue{product.images.length > 1 ? "s" : ""}</span>
          </Link>
          <div className="flex flex-1 flex-col p-5">
            <div className="flex min-h-[92px] items-start justify-between gap-3">
              <div><Link href={productUrl} className="text-lg font-extrabold tracking-tight text-ink transition hover:text-signal">{product.name}</Link><p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">{product.shortDesc}</p></div>
              <ArrowUpRight size={18} className="mt-1 shrink-0 text-slate-300 transition duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-signal" />
            </div>
            <div className="mt-auto flex items-end justify-between gap-3 pt-4">
              <div><span className="block text-xl font-extrabold text-ink">{formatPrice(product.price)}</span><span className="mt-0.5 block text-[11px] text-slate-400">Installation incluse</span></div>
              <Button onPress={addToCart} variant="primary" size="lg" isIconOnly aria-label={justAdded ? `${product.name} ajout\u00e9 au panier` : `Ajouter ${product.name} au panier`} aria-live="polite" className="!h-11 !w-11 !min-w-11 rounded-xl bg-signal text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-ink">
                {justAdded ? <Check size={18} className="animate-check-pop" /> : <ShoppingBag size={17} />}
              </Button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-[11px]"><span className="flex items-center gap-1 rounded-full bg-mint px-2.5 py-1 font-semibold text-emerald-700"><Check size={13} /> {highlight}</span><span className="rounded-full bg-cloud px-2.5 py-1 text-slate-600">{product.stock > 0 ? `${product.stock} en stock` : "Sur commande"}</span></div>
            <Link href={productUrl} className="button button--secondary button--md no-underline mt-4 flex w-full items-center justify-center rounded-xl border border-line px-3 py-2.5 text-sm font-bold text-ink transition duration-200 hover:-translate-y-0.5 hover:border-signal hover:bg-blue-50 hover:text-signal">Voir le produit</Link>
          </div>
        </Card.Content>
      </Card>
    </motion.div>
  );
}
