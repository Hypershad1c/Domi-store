"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { Product } from "@/lib/data";
import { CartDrawer } from "@/components/cart-drawer";

type CartLine = { product: Product; quantity: number };
type CartContextType = {
  lines: CartLine[];
  count: number;
  total: number;
  open: boolean;
  lastAdded: string | null;
  setOpen: (open: boolean) => void;
  add: (product: Product) => void;
  remove: (id: string) => void;
  update: (id: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const value = useMemo(() => ({
    lines,
    open,
    setOpen,
    lastAdded,
    count: lines.reduce((sum, line) => sum + line.quantity, 0),
    total: lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0),
    add: (product: Product) => {
      setLines((previous) => {
        const found = previous.find((line) => line.product.id === product.id);
        return found
          ? previous.map((line) => line.product.id === product.id ? { ...line, quantity: Math.min(line.quantity + 1, 20) } : line)
          : [...previous, { product, quantity: 1 }];
      });
      setLastAdded(product.name);
      window.setTimeout(() => setLastAdded((current) => current === product.name ? null : current), 1800);
    },
    remove: (id: string) => setLines((previous) => previous.filter((line) => line.product.id !== id)),
    update: (id: string, quantity: number) => setLines((previous) => previous.map((line) => line.product.id === id ? { ...line, quantity: Math.max(1, Math.min(quantity, 20)) } : line)),
    clear: () => setLines([]),
  }), [lines, open, lastAdded]);

  return <CartContext.Provider value={value}>{children}<CartDrawer /></CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
