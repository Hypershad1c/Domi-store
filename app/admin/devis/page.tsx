import { redirect } from "next/navigation";
import { Building2, CalendarDays, DoorOpen, MapPin, Tags } from "lucide-react";
import { getAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { AdminNav } from "@/components/admin-nav";

export default async function AdminQuotes() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  let quotes: { id: string; name: string; company: string; city: string; doors: number; model: string; message: string; createdAt: Date }[] = [];
  let unavailable = false;
  try { quotes = await prisma.quoteRequest.findMany({ orderBy: { createdAt: "desc" }, take: 50 }); } catch { unavailable = true; }
  const totalDoors = quotes.reduce((sum, quote) => sum + quote.doors, 0);

  return <main className="flex min-h-screen flex-col bg-[#F5F7FB] lg:flex-row">
    <AdminNav email={admin.email} />
    <section className="min-w-0 flex-1 px-5 py-7 sm:px-8 sm:py-9 xl:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="eyebrow">Développement professionnel</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Demandes de devis</h1><p className="mt-2 text-sm text-slate-500">Projets immobiliers et installations multi-portes.</p></div><span className="inline-flex w-fit items-center gap-2 rounded-xl border border-line bg-white px-4 py-3 text-sm font-bold text-slate-600"><Tags size={16} className="text-signal" />{quotes.length} demandes reçues</span></div>
        {unavailable && <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Les demandes seront affichées quand PostgreSQL sera connecté.</div>}
        <div className="mt-7 grid gap-4 sm:grid-cols-2"><Summary icon={<Tags />} label="Demandes reçues" value={quotes.length.toLocaleString("fr-MA")} /><Summary icon={<DoorOpen />} label="Portes concernées" value={totalDoors.toLocaleString("fr-MA")} /></div>
        {quotes.length ? <div className="mt-7 grid gap-4 xl:grid-cols-2">{quotes.map((quote) => <article key={quote.id} className="rounded-2xl border border-line bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-6"><div className="flex items-start justify-between gap-4"><div className="flex min-w-0 items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-signal"><Building2 size={18} /></span><div className="min-w-0"><h2 className="truncate font-extrabold text-ink">{quote.company}</h2><p className="mt-1 text-sm text-slate-500">{quote.name}</p></div></div><span className="shrink-0 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-extrabold text-blue-700">{quote.doors} porte{quote.doors === 1 ? "" : "s"}</span></div><div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-y border-line py-3 text-xs font-semibold text-slate-500"><span className="inline-flex items-center gap-1.5"><MapPin size={14} className="text-slate-400" />{quote.city}</span><span className="inline-flex items-center gap-1.5"><CalendarDays size={14} className="text-slate-400" />{new Date(quote.createdAt).toLocaleDateString("fr-MA")}</span></div><p className="mt-4 text-sm font-bold text-signal">{quote.model}</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{quote.message}</p></article>)}</div> : <div className="mt-7 grid min-h-72 place-items-center rounded-2xl border border-dashed border-line bg-white px-6 py-12 text-center"><div><span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-cloud text-slate-400"><Tags size={20} /></span><p className="mt-4 font-extrabold text-ink">Aucune demande pour le moment</p><p className="mt-2 text-sm text-slate-500">Les nouveaux projets professionnels apparaîtront ici.</p></div></div>}
      </div>
    </section>
  </main>;
}

function Summary({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="flex items-center gap-4 rounded-2xl border border-line bg-white p-5 shadow-sm"><span className="grid h-10 w-10 place-items-center rounded-xl bg-cloud text-signal">{icon}</span><div><p className="text-xs font-semibold text-slate-500">{label}</p><p className="mt-1 text-2xl font-extrabold text-ink">{value}</p></div></div>;
}
