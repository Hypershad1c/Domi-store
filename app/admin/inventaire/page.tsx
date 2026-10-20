import Link from "next/link";
import { redirect } from "next/navigation";
import { AlertTriangle, ArrowDown, ArrowUp, Boxes, Package, RefreshCw } from "lucide-react";
import { AdminNav } from "@/components/admin-nav";
import { getAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { lowStockThreshold } from "@/lib/inventory";

const reasonLabels: Record<string, string> = { ORDER: "Commande", ADMIN_ADJUSTMENT: "Correction admin", INITIAL_STOCK: "Stock initial", RESTOCK: "Réapprovisionnement" };

export default async function AdminInventory() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");

  let lowStock: { id: string; name: string; slug: string; stock: number }[] = [];
  let movements: { id: string; quantity: number; stockBefore: number; stockAfter: number; reason: string; createdAt: Date; product: { name: string }; order: { id: string } | null }[] = [];
  let unavailable = false;
  try {
    [lowStock, movements] = await Promise.all([
      prisma.product.findMany({ where: { published: true, stock: { lte: lowStockThreshold } }, select: { id: true, name: true, slug: true, stock: true }, orderBy: [{ stock: "asc" }, { name: "asc" }] }),
      prisma.inventoryMovement.findMany({ include: { product: { select: { name: true } }, order: { select: { id: true } } }, orderBy: { createdAt: "desc" }, take: 30 }),
    ]);
  } catch { unavailable = true; }

  return <main className="flex min-h-screen flex-col bg-[#F5F7FB] lg:flex-row">
    <AdminNav email={admin.email} />
    <section className="min-w-0 flex-1 px-5 py-7 sm:px-8 sm:py-9 xl:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><p className="eyebrow">Catalogue</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Inventaire</h1><p className="mt-2 text-sm text-slate-500">Suivez les stocks faibles et l'historique de chaque mouvement.</p></div>
          <Link href="/admin/produits" className="inline-flex items-center justify-center gap-2 rounded-xl bg-signal px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"><Package size={16} />Gérer les produits</Link>
        </div>

        {unavailable && <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-900">La base PostgreSQL n'est pas disponible. Réessayez lorsque la connexion sera rétablie.</div>}

        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-line bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-red-50 text-red-600"><AlertTriangle size={19} /></span><div><p className="text-xs font-semibold text-slate-500">Produits au seuil d'alerte</p><p className="text-2xl font-extrabold text-ink">{lowStock.length}</p></div></div><p className="mt-4 text-xs text-slate-500">Alerte à {lowStockThreshold} unité{lowStockThreshold === 1 ? "" : "s"} ou moins</p></div>
          <div className="rounded-2xl border border-line bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-signal"><RefreshCw size={19} /></span><div><p className="text-xs font-semibold text-slate-500">Mouvements récents</p><p className="text-2xl font-extrabold text-ink">{movements.length}</p></div></div><p className="mt-4 text-xs text-slate-500">Les 30 dernières entrées et sorties de stock</p></div>
        </div>

        <div className="mt-7 grid gap-6 xl:grid-cols-[.85fr_1.35fr]">
          <section className="rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between gap-3"><div><h2 className="font-extrabold text-ink">Stock à surveiller</h2><p className="mt-1 text-xs text-slate-500">Produits publiés sous le seuil configuré</p></div><span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700">{lowStock.length}</span></div>
            {lowStock.length ? <div className="mt-4 divide-y divide-line">{lowStock.map((product) => <div key={product.id} className="flex items-center gap-3 py-3"><span className={`grid h-10 w-10 place-items-center rounded-xl ${product.stock === 0 ? "bg-red-100 text-red-700" : "bg-amber-50 text-amber-700"}`}><Boxes size={18} /></span><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-ink">{product.name}</p><p className="mt-0.5 text-xs text-slate-500">{product.stock === 0 ? "Rupture de stock" : "Stock faible"}</p></div><span className="text-lg font-extrabold text-ink">{product.stock}</span></div>)}</div> : <div className="mt-5 rounded-xl bg-emerald-50 p-4 text-sm font-medium text-emerald-800">Tous les produits publiés ont un stock supérieur au seuil.</div>}
          </section>

          <section className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
            <div className="border-b border-line px-5 py-4 sm:px-6"><h2 className="font-extrabold text-ink">Historique des stocks</h2><p className="mt-1 text-xs text-slate-500">Ventes et ajustements enregistrés</p></div>
            {movements.length ? <div className="divide-y divide-line">{movements.map((movement) => <article key={movement.id} className="flex items-center gap-3 px-5 py-4 sm:px-6"><span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${movement.quantity < 0 ? "bg-orange-50 text-orange-700" : "bg-emerald-50 text-emerald-700"}`}>{movement.quantity < 0 ? <ArrowDown size={16} /> : <ArrowUp size={16} />}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-ink">{movement.product.name}</p><p className="mt-1 text-xs text-slate-500">{reasonLabels[movement.reason] || movement.reason} · {movement.stockBefore} → {movement.stockAfter}{movement.order ? ` · #${movement.order.id.slice(-8)}` : ""}</p></div><div className="text-right"><p className={`text-sm font-extrabold ${movement.quantity < 0 ? "text-orange-700" : "text-emerald-700"}`}>{movement.quantity > 0 ? "+" : ""}{movement.quantity}</p><p className="mt-1 text-[10px] text-slate-400">{new Date(movement.createdAt).toLocaleDateString("fr-MA")}</p></div></article>)}</div> : <div className="p-10 text-center text-sm text-slate-500">Les prochains mouvements de stock apparaîtront ici.</div>}
          </section>
        </div>
      </div>
    </section>
  </main>;
}
