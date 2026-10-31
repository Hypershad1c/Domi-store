"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Boxes, ClipboardList, LayoutDashboard, LifeBuoy, LogOut, Package, ReceiptText, Tags } from "lucide-react";

const links = [
  { href: "/admin", label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: "/admin/produits", label: "Produits", icon: Package },
  { href: "/admin/inventaire", label: "Inventaire", icon: Boxes },
  { href: "/admin/commandes", label: "Commandes", icon: ReceiptText },
  { href: "/admin/devis", label: "Demandes de devis", icon: Tags },
  { href: "/admin/sav", label: "Service après-vente", icon: LifeBuoy },
  { href: "/admin/journal", label: "Journal d’activité", icon: ClipboardList },
];

export function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();
  const visibleLinks = email === "Anonymous" ? links : links.filter((link) => link.href !== "/admin/journal");

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return <aside className="flex w-full shrink-0 flex-col border-b border-line bg-white lg:sticky lg:top-0 lg:min-h-screen lg:w-[260px] lg:border-b-0 lg:border-r">
    <div className="flex items-center gap-3 px-5 py-4 lg:px-6 lg:py-6">
      <img src="/domistore-logo.png" alt="Domi'Lock" className="h-10 w-[108px] object-contain" />
      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-signal">Admin</span>
    </div>
    <div className="hidden border-y border-line px-6 py-4 lg:block">
      <p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-slate-400">Connecté en tant que</p>
      <p className="mt-1 truncate text-sm font-semibold text-ink">{email}</p>
    </div>
    <nav aria-label="Navigation administration" className="grid grid-cols-2 gap-1.5 px-4 pb-4 sm:flex sm:flex-wrap sm:justify-center sm:gap-1 lg:flex-1 lg:flex-col lg:flex-nowrap lg:items-stretch lg:justify-start lg:px-4 lg:py-5">
      {visibleLinks.map(({ href, label, icon: Icon }) => {
        const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
        return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`flex min-w-0 items-center gap-2 rounded-xl px-2.5 py-2.5 text-xs font-semibold transition duration-200 sm:w-auto sm:shrink-0 sm:gap-3 sm:px-3.5 sm:text-sm lg:w-full ${active ? "bg-signal text-white shadow-sm" : "text-slate-600 hover:bg-cloud hover:text-ink"}`}>
          <Icon className="shrink-0" size={17} strokeWidth={active ? 2.3 : 1.8} /><span className="min-w-0 leading-4">{label}</span>{href === "/admin/commandes" && active && <span className="ml-auto hidden text-[10px] font-bold text-blue-100 sm:inline">GESTION</span>}
        </Link>;
      })}
    </nav>
    <div className="flex items-center justify-between border-t border-line px-5 py-3 lg:mt-auto lg:px-6 lg:py-5">
      <div className="min-w-0 lg:hidden"><p className="truncate text-xs font-semibold text-slate-600">{email}</p></div>
      <button onClick={logout} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-600"><LogOut size={16} />Se déconnecter</button>
    </div>
  </aside>;
}
