"use client";
import { ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/data";
import { useCart } from "@/components/cart-provider";
import { whatsappUrl } from "@/lib/utils";
export function ProductActions({ product }: { product: Product }) { const { add, setOpen } = useCart(); return <div className="flex flex-col gap-3 sm:flex-row"><button onClick={() => { add(product); setOpen(true); }} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-signal px-5 py-4 text-sm font-bold text-white transition hover:bg-ink"><ShoppingBag size={18} />Ajouter au panier</button><a href={whatsappUrl(`Bonjour domiStore, je souhaite commander ${product.name} à ${product.price} DH.`)} target="_blank" rel="noreferrer" className="flex flex-1 items-center justify-center rounded-xl border border-line px-5 py-4 text-sm font-bold text-ink transition hover:border-signal hover:text-signal">Commander via WhatsApp</a></div>; }
