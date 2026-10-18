"use client";
import { ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/data";
import { useCart } from "@/components/cart-provider";
export function ProductActions({ product }: { product: Product }) { const { add, setOpen } = useCart(); return <button onClick={() => { add(product); setOpen(true); }} className="flex w-full items-center justify-center gap-2 rounded-xl bg-signal px-5 py-4 text-sm font-bold text-white transition hover:bg-ink"><ShoppingBag size={18} />Ajouter au panier</button>; }
