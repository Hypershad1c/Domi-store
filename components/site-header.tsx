"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Menu, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart-provider";

const navItems = [
  { href: "/boutique", label: "La boutique", detail: "D\u00e9couvrez les serrures" },
  { href: "/comparatif", label: "Comparer", detail: "Trouvez le bon mod\u00e8le" },
  { href: "/compatibilite", label: "Compatibilit\u00e9", detail: "V\u00e9rifiez votre porte" },
  { href: "/espace-pro", label: "Espace Pro", detail: "Solutions multi-portes" },
  { href: "/service-apres-vente", label: "Service apr\u00e8s-vente", detail: "Besoin d'assistance ?" },
  { href: "/suivi-commande", label: "Suivi de commande", detail: "Consultez votre commande" },
  { href: "/contact", label: "Contact", detail: "Parler \u00e0 un conseiller" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const { count, setOpen: setCartOpen } = useCart();

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  if (pathname.startsWith("/admin")) return null;

  const iconButtonClass = isHome
    ? "border-white/20 bg-white/10 text-white hover:border-white/40 hover:bg-white/20"
    : "border-line bg-white text-ink hover:border-signal hover:text-signal";

  return (
    <header className={`z-50 w-full ${isHome ? "absolute inset-x-0 top-0 bg-transparent" : "sticky top-0 border-b border-line/80 bg-white/95 backdrop-blur-xl"}`}>
      <div className="container-page relative flex h-[76px] items-center justify-between gap-3">
        <Link href="/" aria-label="domiStore, accueil" onClick={() => setOpen(false)} className="flex shrink-0 items-center">
          <img src="/domistore-logo.png" alt="Domi'Lock" className={`h-11 w-[142px] object-contain transition-transform duration-300 hover:scale-[1.03] ${isHome ? "brightness-0 invert" : ""}`} />
        </Link>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <button
            aria-label="Ouvrir le panier"
            onClick={() => { setOpen(false); setCartOpen(true); }}
            className={`relative grid h-11 w-11 place-items-center rounded-xl border transition active:scale-95 ${iconButtonClass}`}
          >
            <ShoppingBag size={18} />
            {count > 0 && <span key={count} className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[10px] font-extrabold text-ink animate-count-pop">{count}</span>}
          </button>
          <button
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((value) => !value)}
            className={`grid h-11 w-11 place-items-center rounded-xl border transition active:scale-95 ${iconButtonClass}`}
          >
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <>
            <motion.button
              type="button"
              aria-label="Fermer le menu"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 cursor-default bg-ink/20"
            />
            <motion.nav
              id="site-menu"
              aria-label="Navigation principale"
              initial={reduceMotion ? false : { opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className={`absolute right-0 top-[calc(100%-4px)] z-50 w-full overflow-hidden rounded-2xl border shadow-2xl sm:w-[360px] ${isHome ? "border-white/15 bg-[#0C1E3E]/95 text-white backdrop-blur-2xl" : "border-line bg-white text-ink"}`}
            >
              <div className={`border-b px-5 py-4 ${isHome ? "border-white/10" : "border-line"}`}>
                <p className={`text-[10px] font-extrabold uppercase tracking-[.18em] ${isHome ? "text-blue-200" : "text-signal"}`}>Navigation</p>
                <p className="mt-1 text-lg font-extrabold">Que cherchez-vous ?</p>
              </div>
              <div className="grid gap-1 p-2">
                {navItems.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`group flex items-center justify-between rounded-xl px-3 py-3 transition ${isHome ? "hover:bg-white/10" : "hover:bg-cloud"}`}
                  >
                    <span>
                      <span className="block text-sm font-bold">{item.label}</span>
                      <span className={`mt-0.5 block text-xs ${isHome ? "text-white/50" : "text-slate-500"}`}>{item.detail}</span>
                    </span>
                    <ArrowUpRight size={16} className={`transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${isHome ? "text-white/40 group-hover:text-white" : "text-slate-300 group-hover:text-signal"}`} />
                  </Link>
                ))}
              </div>
              <div className={`px-5 pb-4 pt-1 text-[10px] font-semibold ${isHome ? "text-white/35" : "text-slate-400"}`}>Appuyez sur Échap pour fermer</div>
            </motion.nav>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
