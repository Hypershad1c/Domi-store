import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowDownRight, ArrowRight, ArrowUpRight, CircleHelp, ExternalLink, LifeBuoy, Package, Plus, ReceiptText, Tags, TrendingUp } from "lucide-react";
import { getAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { products } from "@/lib/data";
import { AdminNav } from "@/components/admin-nav";

const statusLabels: Record<string, string> = { NEW: "À confirmer", CONFIRMED: "Confirmée", SHIPPED: "Expédiée", DELIVERED: "Livrée", CANCELLED: "Annulée" };

export default async function AdminDashboard() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");

  let stats = { orders: 0, newOrders: 0, revenue: 0, products: products.length, support: 0, quotes: 0 };
  let recentOrders: { id: string; customerName: string; city: string; total: number; status: string; createdAt: Date }[] = [];
  let databaseReady = false;
  try {
    const [orderCount, newOrders, revenue, productCount, support, quotes, latest] = await Promise.all([
      prisma.order.count({ where: { status: { not: "CANCELLED" } } }),
      prisma.order.count({ where: { status: "NEW" } }),
      prisma.order.aggregate({ where: { status: { not: "CANCELLED" } }, _sum: { total: true } }),
      prisma.product.count({ where: { published: true } }),
      prisma.supportRequest.count({ where: { status: "NEW" } }),
      prisma.quoteRequest.count(),
      prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 6, select: { id: true, customerName: true, city: true, total: true, status: true, createdAt: true } }),
    ]);
    stats = { orders: orderCount, newOrders, revenue: revenue._sum.total || 0, products: productCount, support, quotes };
    recentOrders = latest;
    databaseReady = true;
  } catch {}

  return <main className="flex min-h-screen flex-col bg-[#F5F7FB] lg:flex-row">
    <AdminNav email={admin.email} />
    <section className="min-w-0 flex-1 px-5 py-7 sm:px-8 sm:py-9 xl:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div><p className="eyebrow">Espace de travail</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Bonjour, domiStore.</h1><p className="mt-2 text-sm text-slate-500">Voici ce qui se passe dans votre boutique.</p></div>
          <div className="flex flex-wrap gap-2"><Link href="/admin/produits" className="inline-flex items-center gap-2 rounded-xl bg-signal px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"><Plus size={16} />Ajouter un produit</Link><a href="/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:text-signal">Voir la boutique <ExternalLink size={15} /></a></div>
        </div>

        {!databaseReady && <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><CircleHelp size={18} className="mt-0.5 shrink-0" /><div><p className="font-bold">Base de données non connectée</p><p className="mt-1 leading-6">Les données du tableau de bord s’afficheront dès que PostgreSQL sera configuré. Les pages de gestion restent accessibles.</p></div></div>}

        <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Stat icon={<ReceiptText />} label="Commandes actives" value={String(stats.orders)} detail={stats.newOrders ? `${stats.newOrders} à confirmer` : "Aucune à confirmer"} tone="blue" href="/admin/commandes" />
          <Stat icon={<TrendingUp />} label="Chiffre d'affaires" value={`${stats.revenue.toLocaleString("fr-MA")} DH`} detail="Commandes non annulées" tone="mint" href="/admin/commandes" />
          <Stat icon={<Package />} label="Produits publiés" value={String(stats.products)} detail="Dans le catalogue" tone="violet" href="/admin/produits" />
          <Stat icon={<LifeBuoy />} label="Demandes à traiter" value={String(stats.support + stats.quotes)} detail={`${stats.support} SAV · ${stats.quotes} devis`} tone="orange" href="/admin/sav" />
        </div>

        <div className="mt-7 grid gap-5 xl:grid-cols-[1.55fr_.85fr]">
          <section className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
            <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-6"><div><h2 className="font-extrabold text-ink">Commandes récentes</h2><p className="mt-1 text-xs text-slate-500">Les dernières commandes reçues</p></div><Link href="/admin/commandes" className="inline-flex items-center gap-1 text-sm font-bold text-signal hover:text-blue-800">Tout voir <ArrowRight size={15} /></Link></div>
            {recentOrders.length ? <div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left text-sm"><thead className="bg-[#FAFBFD] text-[10px] font-bold uppercase tracking-wider text-slate-400"><tr><th className="px-5 py-3 sm:px-6">Client</th><th className="px-4 py-3">Ville</th><th className="px-4 py-3">Montant</th><th className="px-4 py-3">Statut</th><th className="px-5 py-3 sm:px-6">Date</th></tr></thead><tbody>{recentOrders.map((order) => <tr key={order.id} className="border-t border-line transition hover:bg-[#FAFBFD]"><td className="px-5 py-4 font-bold text-ink sm:px-6">{order.customerName}<span className="mt-1 block max-w-32 truncate font-mono text-[10px] font-normal text-slate-400">{order.id}</span></td><td className="px-4 py-4 text-slate-600">{order.city}</td><td className="px-4 py-4 font-bold text-ink">{order.total.toLocaleString("fr-MA")} DH</td><td className="px-4 py-4"><StatusPill status={order.status} /></td><td className="px-5 py-4 text-xs text-slate-500 sm:px-6">{new Date(order.createdAt).toLocaleDateString("fr-MA")}</td></tr>)}</tbody></table></div> : <div className="grid min-h-56 place-items-center px-6 py-10 text-center"><div><span className="mx-auto grid h-11 w-11 place-items-center rounded-2xl bg-cloud text-slate-400"><ReceiptText size={19} /></span><p className="mt-3 text-sm font-bold text-ink">Pas encore de commande</p><p className="mt-1 text-xs text-slate-500">Les nouvelles commandes apparaîtront ici.</p></div></div>}
          </section>

          <section className="rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-6"><div className="flex items-start justify-between"><div><h2 className="font-extrabold text-ink">Accès rapides</h2><p className="mt-1 text-xs text-slate-500">Les tâches courantes</p></div><span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-signal"><ArrowUpRight size={18} /></span></div><div className="mt-5 space-y-2"><QuickLink href="/admin/produits" icon={<Package size={17} />} title="Gérer le catalogue" detail="Prix, stock et visuels" /><QuickLink href="/admin/commandes" icon={<ReceiptText size={17} />} title="Traiter les commandes" detail={stats.newOrders ? `${stats.newOrders} en attente` : "Consulter les commandes"} /><QuickLink href="/admin/devis" icon={<Tags size={17} />} title="Demandes de devis" detail="Projets professionnels" /><QuickLink href="/admin/sav" icon={<LifeBuoy size={17} />} title="Demandes SAV" detail={stats.support ? `${stats.support} à traiter` : "Assistance après-vente"} /></div><div className="mt-5 rounded-xl bg-[#F6F8FC] p-4"><p className="text-xs font-bold text-ink">Besoin d’un coup de main ?</p><p className="mt-1 text-xs leading-5 text-slate-500">Contactez l’équipe pour vous aider à gérer votre boutique.</p><Link href="/contact" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-signal">Contacter le support <ArrowDownRight size={13} /></Link></div></section>
        </div>
      </div>
    </section>
  </main>;
}

function Stat({ icon, label, value, detail, tone, href }: { icon: React.ReactNode; label: string; value: string; detail: string; tone: "blue" | "mint" | "violet" | "orange"; href: string }) {
  const tones = { blue: "bg-blue-50 text-blue-700", mint: "bg-emerald-50 text-emerald-700", violet: "bg-violet-50 text-violet-700", orange: "bg-orange-50 text-orange-700" };
  return <Link href={href} className="rounded-2xl border border-line bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"><div className="flex items-center justify-between"><span className={`grid h-10 w-10 place-items-center rounded-xl ${tones[tone]} [&>svg]:h-[18px] [&>svg]:w-[18px]`}>{icon}</span><ArrowUpRight size={16} className="text-slate-300" /></div><p className="mt-5 text-xs font-semibold text-slate-500">{label}</p><p className="mt-1 text-2xl font-extrabold tracking-tight text-ink">{value}</p><p className="mt-1 text-[11px] font-medium text-slate-400">{detail}</p></Link>;
}

function QuickLink({ href, icon, title, detail }: { href: string; icon: React.ReactNode; title: string; detail: string }) {
  return <Link href={href} className="group flex items-center gap-3 rounded-xl p-3 transition hover:bg-[#F6F8FC]"><span className="grid h-9 w-9 place-items-center rounded-lg bg-cloud text-slate-500 transition group-hover:bg-blue-50 group-hover:text-signal">{icon}</span><span className="min-w-0 flex-1"><span className="block text-sm font-bold text-ink">{title}</span><span className="mt-0.5 block truncate text-xs text-slate-500">{detail}</span></span><ArrowRight size={15} className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-signal" /></Link>;
}

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = { NEW: "bg-amber-50 text-amber-700", CONFIRMED: "bg-blue-50 text-blue-700", SHIPPED: "bg-violet-50 text-violet-700", DELIVERED: "bg-emerald-50 text-emerald-700", CANCELLED: "bg-red-50 text-red-700" };
  return <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-bold ${styles[status] || "bg-cloud text-slate-600"}`}>{statusLabels[status] || status}</span>;
}
