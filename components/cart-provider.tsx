"use client";
import { createContext, useContext, useMemo, useState } from "react";
import type { Product } from "@/lib/data";

type CartLine = { product: Product; quantity: number };
type CartContextType = { lines: CartLine[]; count: number; total: number; open: boolean; setOpen: (open: boolean) => void; add: (product: Product) => void; remove: (id: string) => void; update: (id: string, quantity: number) => void; clear: () => void };
const CartContext = createContext<CartContextType | null>(null);
export function CartProvider({ children }: { children: React.ReactNode }) { const [lines, setLines] = useState<CartLine[]>([]); const [open, setOpen] = useState(false); const value = useMemo(() => ({ lines, open, setOpen, count: lines.reduce((s, l) => s + l.quantity, 0), total: lines.reduce((s, l) => s + l.product.price * l.quantity, 0), add: (product: Product) => setLines((prev) => { const found = prev.find((l) => l.product.id === product.id); return found ? prev.map((l) => l.product.id === product.id ? { ...l, quantity: Math.min(l.quantity + 1, 20) } : l) : [...prev, { product, quantity: 1 }]; }), remove: (id: string) => setLines((prev) => prev.filter((l) => l.product.id !== id)), update: (id: string, quantity: number) => setLines((prev) => prev.map((l) => l.product.id === id ? { ...l, quantity: Math.max(1, Math.min(quantity, 20)) } : l)), clear: () => setLines([]) }), [lines, open]); return <CartContext.Provider value={value}>{children}<CartDrawer /></CartContext.Provider>; }
export function useCart() { const context = useContext(CartContext); if (!context) throw new Error("useCart must be used inside CartProvider"); return context; }
import { CartDrawer } from "@/components/cart-drawer";
