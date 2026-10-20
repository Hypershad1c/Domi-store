import { redirect } from "next/navigation";
import { Download, PackageCheck, Search } from "lucide-react";
import { getAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { AdminNav } from "@/components/admin-nav";
import { OrderStatus } from "@/components/order-status";

const allowedStatuses = ["NEW", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];
export default async function AdminOrders({ searchParams }: { searchParams?: Promise<{ q?: string; status?: string }> }) {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  const params = (await searchParams) || {};
  const q = params.q?.trim() || "";
  const status = params.status && allowedStatuses.includes(params.status) ? params.status : undefined;
  let orders: { id: string; customerName: string; phone: string; city: string; total: number; status: string; createdAt: Date }[] = [];
  let unavailable = false;
  try {
    orders = await prisma.order.findMany({
      where: {
        ...(status ? { status: status as never } : {}),
        ...(q ? { OR: [{ customerName: { contains: q, mode: "insensitive" } }, { phone: { contains: q, mode: "insensitive" } }, { city: { contains: q, mode: "insensitive" } }] } : {})
      },
      orderBy: { createdAt: "desc" },
      take: 100
    });
  } catch { unavailable = true; }

  return <main className="flex min-h-screen flex-col bg-[#F5F7FB] lg:flex-row">
    <AdminNav email={admin.email} />
    <section className="min-w-0 flex-1 px-5 py-7 sm:px-8 sm:py-9 xl:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><p className="eyebrow">Ventes</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Commandes</h1><p className="mt-2 text-sm text-slate-500">Consultez les commandes et mettez leur statut à jour.</p></div>
          <a href="/api/admin/orders/export" className="inline-flex items-center justify-center gap-2 rounded-xl bg-signal px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"><Download size={16} />Télécharger Excel</a>
        </div>

        {unavailable && <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-900">La base PostgreSQL n’est pas connectée. Les commandes apparaîtront ici dès qu’elle sera disponible.</div>}

        <div className="mt-7 grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px_auto]">
          <form className="contents" method="get"><label className="relative block"><Search size={17} className="absolute left-3.5 top-3.5 text-slate-400" /><input name="q" defaultValue={q} placeholder="Nom, téléphone ou ville" className="w-full rounded-xl border border-line bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-signal focus:ring-4 focus:ring-blue-100" /></label><select name="status" defaultValue={status || ""} className="rounded-xl border border-line bg-white px-3 py-3 text-sm outline-none focus:border-signal"><option value="">Tous les statuts</option><option value="NEW">À confirmer</option><option value="CONFIRMED">Confirmées</option><option value="SHIPPED">Expédiées</option><option value="DELIVERED">Livrées</option><option value="CANCELLED">Annulées</option></select><button className="rounded-xl bg-ink px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-700">Filtrer</button></form>
        </div>

        <div className="mt-5 flex items-center justify-between text-xs text-slate-500"><span>{orders.length} commande{orders.length === 1 ? "" : "s"}{q || status ? " correspondant aux filtres" : " récentes"}</span><span>Maximum 100 résultats</span></div>

        <div className="mt-3 hidden overflow-hidden rounded-2xl border border-line bg-white shadow-sm md:block">
          <div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-sm"><thead className="bg-[#FAFBFD] text-[10px] font-extrabold uppercase tracking-wider text-slate-400"><tr><th className="px-5 py-4">Client</th><th className="px-4 py-4">Téléphone</th><th className="px-4 py-4">Ville</th><th className="px-4 py-4">Total</th><th className="px-4 py-4">Statut</th><th className="px-5 py-4">Date</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id} className="border-t border-line transition hover:bg-[#FAFBFD]"><td className="px-5 py-4"><span className="font-bold text-ink">{order.customerName}</span><span className="mt-1 block font-mono text-[10px] text-slate-400">{order.id}</span></td><td className="px-4 py-4 text-slate-600">{order.phone}</td><td className="px-4 py-4 text-slate-600">{order.city}</td><td className="px-4 py-4 font-extrabold text-ink">{order.total.toLocaleString("fr-MA")} DH</td><td className="px-4 py-4"><OrderStatus id={order.id} initial={order.status} /></td><td className="px-5 py-4 text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString("fr-MA")}</td></tr>)}{!orders.length && <tr><td colSpan={6} className="p-14 text-center"><EmptyOrders unavailable={unavailable} /></td></tr>}</tbody></table></div>
        </div>

        <div className="mt-3 space-y-3 md:hidden">{orders.map((order) => <article key={order.id} className="rounded-2xl border border-line bg-white p-4 shadow-sm"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><h2 className="truncate font-extrabold text-ink">{order.customerName}</h2><p className="mt-1 text-xs text-slate-500">{order.phone} · {order.city}</p></div><p className="shrink-0 text-sm font-extrabold text-ink">{order.total.toLocaleString("fr-MA")} DH</p></div><div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3"><div><p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Statut commande</p><OrderStatus id={order.id} initial={order.status} /></div><p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString("fr-MA")}</p></div></article>)}{!orders.length && <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center"><EmptyOrders unavailable={unavailable} /></div>}</div>
      </div>
    </section>
  </main>;
}

function EmptyOrders({ unavailable }: { unavailable: boolean }) {
  return <div className="mx-auto max-w-sm"><span className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-cloud text-slate-400"><PackageCheck size={19} /></span><p className="mt-3 text-sm font-bold text-ink">{unavailable ? "Connexion à la base requise" : "Aucune commande"}</p><p className="mt-1 text-xs leading-5 text-slate-500">{unavailable ? "Vérifiez la configuration PostgreSQL." : "Les nouvelles commandes apparaîtront dans cette liste."}</p></div>;
}
