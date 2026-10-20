import { redirect } from "next/navigation";
import { CalendarClock, LifeBuoy, MapPin, Phone, Wrench } from "lucide-react";
import { getAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { AdminNav } from "@/components/admin-nav";
import { SupportStatus } from "@/components/support-status";

export default async function AdminSav() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  let requests: { id: string; customerName: string; phone: string; city: string; orderRef: string | null; model: string | null; issue: string; preferredTime: string | null; status: string; createdAt: Date }[] = [];
  let unavailable = false;
  try { requests = await prisma.supportRequest.findMany({ orderBy: { createdAt: "desc" }, take: 100 }); } catch { unavailable = true; }
  const openCount = requests.filter((request) => request.status === "NEW" || request.status === "IN_PROGRESS").length;
  const progressCount = requests.filter((request) => request.status === "IN_PROGRESS").length;
  const resolvedCount = requests.filter((request) => request.status === "RESOLVED" || request.status === "CLOSED").length;

  return <main className="flex min-h-screen flex-col bg-[#F5F7FB] lg:flex-row">
    <AdminNav email={admin.email} />
    <section className="min-w-0 flex-1 px-5 py-7 sm:px-8 sm:py-9 xl:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="eyebrow">Accompagnement client</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Service après-vente</h1><p className="mt-2 text-sm text-slate-500">Suivez les demandes de diagnostic, garantie et intervention.</p></div><span className="inline-flex w-fit items-center gap-2 rounded-xl border border-line bg-white px-4 py-3 text-sm font-bold text-slate-600"><LifeBuoy size={16} className="text-signal" />{requests.length} demandes</span></div>
        {unavailable && <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Les demandes SAV apparaîtront quand PostgreSQL sera connecté.</div>}
        <div className="mt-7 grid gap-3 sm:grid-cols-3"><Summary label="À traiter" value={openCount} tone="amber" /><Summary label="En cours" value={progressCount} tone="blue" /><Summary label="Résolues / clôturées" value={resolvedCount} tone="green" /></div>
        <div className="mt-6 space-y-4">{requests.map((request) => <article key={request.id} className="rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-6"><div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start"><div className="flex min-w-0 items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-signal"><Wrench size={18} /></span><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="font-extrabold text-ink">{request.customerName}</h2>{request.model && <span className="rounded-full bg-cloud px-2.5 py-1 text-[10px] font-bold text-slate-500">{request.model}</span>}</div><div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500"><a href={`tel:${request.phone.replace(/[^+\d]/g, "")}`} className="inline-flex items-center gap-1 hover:text-signal"><Phone size={12} />{request.phone}</a><span className="inline-flex items-center gap-1"><MapPin size={12} />{request.city}</span>{request.orderRef && <span>Commande {request.orderRef}</span>}</div></div></div><SupportStatus id={request.id} initial={request.status} /></div><div className="mt-5 rounded-xl bg-[#F7F9FC] p-4 text-sm leading-6 text-slate-700">{request.issue}</div><div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-400"><span className="inline-flex items-center gap-1.5"><CalendarClock size={13} />Créée le {new Date(request.createdAt).toLocaleDateString("fr-MA")}</span>{request.preferredTime && <span>Créneau souhaité : {request.preferredTime}</span>}</div></article>)}{!requests.length && <div className="grid min-h-64 place-items-center rounded-2xl border border-dashed border-line bg-white p-10 text-center"><div><span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-cloud text-slate-400"><LifeBuoy size={20} /></span><p className="mt-4 font-extrabold text-ink">Aucune demande SAV</p><p className="mt-2 text-sm text-slate-500">Les clients pourront suivre leurs demandes ici.</p></div></div>}</div>
      </div>
    </section>
  </main>;
}

function Summary({ label, value, tone }: { label: string; value: number; tone: "amber" | "blue" | "green" }) {
  const tones = { amber: "bg-amber-50 text-amber-700", blue: "bg-blue-50 text-blue-700", green: "bg-emerald-50 text-emerald-700" };
  return <div className="flex items-center justify-between rounded-2xl border border-line bg-white p-4 shadow-sm"><span className="text-xs font-semibold text-slate-500">{label}</span><span className={`grid min-w-9 place-items-center rounded-lg px-2 py-1.5 text-sm font-extrabold ${tones[tone]}`}>{value}</span></div>;
}
