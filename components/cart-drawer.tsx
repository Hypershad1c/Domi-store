"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/components/cart-provider";

export function CartDrawer() {
  const { open, setOpen, lines, total, update, remove, lastAdded } = useCart();
  const [rendered, setRendered] = useState(open);
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    if (open) {
      setRendered(true);
      const frame = window.requestAnimationFrame(() => setVisible(true));
      return () => window.cancelAnimationFrame(frame);
    }
    setVisible(false);
    const timer = window.setTimeout(() => setRendered(false), 240);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!visible) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [visible, setOpen]);

  if (!rendered) return null;

  return (
    <div className={`fixed inset-0 z-50 transition-opacity duration-200 ${visible ? "opacity-100" : "pointer-events-none opacity-0"}`}>
      <button aria-label="Fermer le panier" tabIndex={visible ? 0 : -1} className="absolute inset-0 bg-ink/35" onClick={() => setOpen(false)} />
      <aside role="dialog" aria-modal="true" aria-hidden={!visible} aria-label="Votre panier" className={`absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl transition-transform duration-200 ease-out ${visible ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between border-b border-line pb-5">
          <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-cloud text-signal"><ShoppingBag size={18} /></span><div><p className="font-bold">Votre panier</p><p className="text-xs text-slate-500">Paiement à la livraison</p></div></div>
          <button aria-label="Fermer" onClick={() => setOpen(false)} className="grid h-9 w-9 place-items-center rounded-full text-slate-500 transition hover:bg-cloud hover:text-ink active:scale-90"><X size={19} /></button>
        </div>
        {lastAdded && <p role="status" className="mt-4 flex items-center gap-2 rounded-xl bg-mint px-3 py-2.5 text-sm font-semibold text-emerald-800 animate-confirm"><Check size={16} /> {lastAdded} ajouté au panier</p>}
        {lines.length === 0 ? (
          <div className="py-20 text-center text-slate-500"><ShoppingBag className="mx-auto mb-4 text-slate-300" size={34} /><p>Votre panier est encore vide.</p><Link href="/boutique" onClick={() => setOpen(false)} className="mt-5 inline-block font-bold text-signal transition hover:translate-x-1">Voir la boutique →</Link></div>
        ) : <>
          <div className="divide-y divide-line">{lines.map(({ product, quantity }, index) => (
            <div key={product.id} className="flex gap-3 py-5 animate-cart-item" style={{ animationDelay: `${index * 60}ms` }}>
              <img src={product.images[0]} alt="" className="h-16 w-16 rounded-xl bg-cloud object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex justify-between gap-3"><p className="font-bold">{product.name}</p><button aria-label={`Retirer ${product.name}`} onClick={() => remove(product.id)} className="text-slate-400 transition hover:scale-110 hover:text-red-500"><Trash2 size={15} /></button></div>
                <p className="mt-1 text-sm font-semibold text-signal">{formatPrice(product.price)}</p>
                <div className="mt-3 flex items-center gap-2">
                  <button aria-label="Diminuer" className="grid h-7 w-7 place-items-center rounded-lg border border-line transition hover:border-signal hover:text-signal active:scale-90" onClick={() => update(product.id, quantity - 1)}><Minus size={12} /></button>
                  <span className="w-5 text-center text-sm tabular-nums">{quantity}</span>
                  <button aria-label="Augmenter" className="grid h-7 w-7 place-items-center rounded-lg border border-line transition hover:border-signal hover:text-signal active:scale-90" onClick={() => update(product.id, quantity + 1)}><Plus size={12} /></button>
                </div>
              </div>
            </div>
          ))}</div>
          <div className="mt-6 border-t border-line pt-5"><div className="flex items-center justify-between text-lg font-extrabold"><span>Total</span><span>{formatPrice(total)}</span></div><Link href="/panier" onClick={() => setOpen(false)} className="mt-5 block rounded-xl bg-signal px-5 py-3.5 text-center text-sm font-bold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-ink active:scale-[.98]">Passer la commande</Link></div>
        </>}
      </aside>
    </div>
  );
}
