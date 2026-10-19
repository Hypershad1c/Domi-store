"use client";
import { ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/data";
import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/utils";
export function ProductActions({ product }: { product: Product }) { const { add, setOpen } = useCart(); function addToCart() { add(product); setOpen(true); } return <><button onClick={addToCart} className="flex w-full items-center justify-center gap-2 rounded-xl bg-signal px-5 py-4 text-sm font-bold text-white transition hover:bg-ink"><ShoppingBag size={18} />Ajouter au panier</button><div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 p-3 shadow-[0_-8px_30px_rgba(15,31,77,.12)] backdrop-blur md:hidden"><div className="mx-auto flex max-w-lg items-center gap-3"><div className="min-w-0 flex-1"><p className="truncate text-xs font-bold text-slate-500">{product.name}</p><p className="text-lg font-extrabold text-ink">{formatPrice(product.price)}</p></div><button onClick={addToCart} className="flex shrink-0 items-center gap-2 rounded-xl bg-signal px-4 py-3 text-sm font-bold text-white"><ShoppingBag size={16} />Ajouter</button></div></div></>; }
