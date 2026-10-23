"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertCircle, Check, CheckCircle2, Clock3, PackageCheck, RefreshCw, Search, Truck, XCircle } from "lucide-react";
import { formatPrice } from "@/lib/utils";

type TrackingOrder = {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  items: { name: string; quantity: number; price: number }[];
  history: { status: string | null; createdAt: string }[];
};

const steps = [
  { status: "NEW", label: "Commande reçue", detail: "Votre demande est enregistrée.", icon: CheckCircle2 },
  { status: "CONFIRMED", label: "Confirmée", detail: "Notre équipe a vérifié votre commande.", icon: Check },
  { status: "SHIPPED", label: "En livraison", detail: "La livraison et l’installation se préparent.", icon: Truck },
  { status: "DELIVERED", label: "Livrée", detail: "Votre commande a été remise.", icon: PackageCheck },
];

const statusLabels: Record<string, string> = {
  NEW: "En attente de confirmation",
  CONFIRMED: "Confirmée",
  SHIPPED: "En livraison",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
};

const nextMessages: Record<string, { title: string; text: string }> = {
  NEW: { title: "Prochaine étape : confirmation", text: "Notre équipe vérifie votre commande et vous contactera pour la confirmer." },
  CONFIRMED: { title: "Votre commande est confirmée", text: "Nous préparons la suite et notre équipe vous contactera pour organiser la livraison et l’installation." },
  SHIPPED: { title: "La livraison est en cours", text: "Notre équipe coordonne la remise et l’installation. Contactez-nous si vous avez une contrainte de disponibilité." },
  DELIVERED: { title: "Votre commande est livrée", text: "Besoin d’aide avec votre serrure ou son installation ? Notre équipe reste disponible après la pose." },
};

const formatDate = (value: string) => new Date(value).toLocaleString("fr-MA", { dateStyle: "medium", timeStyle: "short" });

export function OrderTracking({ initialReference = "" }: { initialReference?: string }) {
  const [reference, setReference] = useState(initialReference);
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<TrackingOrder | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function lookup(preserveOrder = false) {
    if (!reference || !phone) return;
    setLoading(true);
    setError("");
    if (!preserveOrder) setOrder(null);
    try {
      const response = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference, phone }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Impossible de retrouver cette commande.");
      setOrder(result as TrackingOrder);
    } catch (lookupError) {
      setError(lookupError instanceof Error ? lookupError.message : "Impossible de retrouver cette commande.");
    } finally {
      setLoading(false);
    }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await lookup();
  }

  const currentStep = order ? steps.findIndex((step) => step.status === order.status) : -1;
  const updates = useMemo(() => order ? [{ status: "NEW", createdAt: order.createdAt }, ...order.history] : [], [order]);
  const stepDates = useMemo(() => {
    if (!order) return new Map<string, string>();
    const dates = new Map<string, string>([["NEW", order.createdAt]]);
    for (const entry of order.history) if (entry.status) dates.set(entry.status, entry.createdAt);
    return dates;
  }, [order]);
  const nextMessage = order ? nextMessages[order.status] : null;

  return <main>
    <section className="grid-lines border-b border-line py-14 sm:py-20">
      <div className="container-page">
        <p className="eyebrow">Suivi de commande</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl">Où en est votre commande ?</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-500">Saisissez la référence reçue après votre commande et le numéro de téléphone utilisé lors de l’achat.</p>
        <form onSubmit={submit} className="mt-8 grid gap-4 rounded-2xl border border-line bg-white p-5 shadow-card sm:grid-cols-[1fr_1fr_auto] sm:items-end sm:p-6">
          <label className="block text-sm font-semibold">Référence de commande<input required minLength={12} maxLength={100} value={reference} onChange={(event) => setReference(event.target.value)} placeholder="Ex. cm..." autoComplete="off" className="mt-2 w-full rounded-xl border border-line bg-cloud px-3 py-3 font-mono text-sm outline-none focus:border-signal" /></label>
          <label className="block text-sm font-semibold">Téléphone de la commande<input required minLength={8} maxLength={30} type="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="06 00 00 00 00" className="mt-2 w-full rounded-xl border border-line bg-cloud px-3 py-3 outline-none focus:border-signal" /></label>
          <button disabled={loading} className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-signal px-5 py-3 text-sm font-bold text-white transition hover:bg-ink disabled:opacity-60">{loading ? <Clock3 size={17} className="animate-spin" /> : <Search size={17} />}{loading ? "Recherche…" : "Voir le suivi"}</button>
        </form>
        {error && <p role="alert" className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700"><AlertCircle className="mt-0.5 shrink-0" size={17} />{error}</p>}
      </div>
    </section>

    {order && <section className="container-page py-10 sm:py-14" aria-live="polite">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(17rem,.8fr)] lg:items-start">
        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
          <div className="flex flex-col justify-between gap-4 border-b border-line p-5 sm:flex-row sm:items-start sm:p-7">
            <div className="min-w-0"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Référence de commande</p><p className="mt-1 break-all font-mono text-sm font-bold text-ink">{order.id}</p><p className="mt-2 text-sm text-slate-500">Passée le {formatDate(order.createdAt)}</p></div>
            <div className="flex flex-wrap items-center gap-2"><span className={`inline-flex w-fit shrink-0 items-center gap-2 rounded-full px-3 py-2 text-sm font-bold ${order.status === "CANCELLED" ? "bg-red-50 text-red-700" : order.status === "DELIVERED" ? "bg-mint text-emerald-700" : "bg-blue-50 text-signal"}`}>
              {order.status === "CANCELLED" ? <XCircle size={16} /> : <PackageCheck size={16} />}{statusLabels[order.status] || "Statut mis à jour"}
            </span><button type="button" onClick={() => lookup(true)} disabled={loading} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-line bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-signal hover:text-signal disabled:opacity-50"><RefreshCw size={14} className={loading ? "animate-spin" : ""} />Actualiser</button></div>
          </div>

          {order.status === "CANCELLED" ? <div className="m-5 flex gap-3 rounded-xl bg-red-50 p-4 text-sm leading-6 text-red-800 sm:m-7"><XCircle className="mt-0.5 shrink-0" size={18} /><p>Cette commande a été annulée. Contactez notre équipe si vous souhaitez plus d’informations.</p></div> : <div className="p-5 sm:p-7">
            {nextMessage && <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4 sm:p-5"><p className="text-sm font-extrabold text-ink">{nextMessage.title}</p><p className="mt-1 text-sm leading-6 text-slate-600">{nextMessage.text}</p></div>}
            <div className="mt-7" aria-label="Progression de la commande">
              <div className="mb-5 flex items-center justify-between gap-3"><h2 className="font-extrabold text-ink">Progression</h2><span className="text-xs font-bold text-slate-500">Étape {Math.max(1, currentStep + 1)} sur {steps.length}</span></div>
              <div className="grid gap-0 sm:grid-cols-4 sm:gap-2">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const complete = currentStep >= index;
                  const date = complete ? stepDates.get(step.status) : undefined;
                  return <div key={step.status} className="relative flex gap-3 pb-5 last:pb-0 sm:block sm:pb-0">
                    {index < steps.length - 1 && <span aria-hidden="true" className={`absolute left-[17px] top-10 h-[calc(100%-28px)] w-0.5 sm:left-[18px] sm:top-[18px] sm:h-0.5 sm:w-[calc(100%+8px)] ${currentStep > index ? "bg-signal" : "bg-line"}`} />}
                    <span className={`relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full ring-4 ring-white ${complete ? "bg-signal text-white" : "bg-cloud text-slate-400"}`}><Icon size={17} /></span>
                    <div className="min-w-0 sm:mt-3 sm:pr-2"><p className={`text-sm font-bold ${complete ? "text-ink" : "text-slate-400"}`}>{step.label}</p><p className="mt-1 text-xs leading-5 text-slate-500">{step.detail}</p>{date && <time className="mt-2 block text-[11px] font-semibold text-signal">{formatDate(date)}</time>}</div>
                  </div>;
                })}
              </div>
            </div>
          </div>}

          <div className="grid gap-7 border-t border-line p-5 sm:p-7 md:grid-cols-[1fr_.8fr]">
            <div><div className="flex items-center justify-between gap-3"><h2 className="font-extrabold text-ink">Articles commandés</h2><span className="text-xs font-semibold text-slate-400">{order.items.length} article{order.items.length === 1 ? "" : "s"}</span></div><ul className="mt-3 divide-y divide-line">{order.items.map((item, index) => <li key={`${item.name}-${index}`} className="flex justify-between gap-4 py-3 text-sm"><span className="min-w-0">{item.name}<span className="ml-2 text-slate-400">× {item.quantity}</span></span><span className="shrink-0 font-semibold">{formatPrice(item.price * item.quantity)}</span></li>)}</ul><p className="mt-3 flex justify-between border-t border-line pt-4 font-extrabold"><span>Total</span><span>{formatPrice(order.total)}</span></p></div>
            <div><h2 className="font-extrabold text-ink">Historique</h2><ol className="mt-4 space-y-4">{updates.map((entry, index) => <li key={`${entry.status}-${entry.createdAt}-${index}`} className="relative flex gap-3 text-sm"><span className={`relative z-10 mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full ${index === updates.length - 1 ? "bg-signal text-white" : "bg-mint text-emerald-700"}`}><Check size={13} /></span><span className="min-w-0"><span className="font-semibold text-ink">{statusLabels[entry.status || ""] || "Mise à jour"}</span><time className="mt-1 block text-xs text-slate-400">{formatDate(entry.createdAt)}</time></span></li>)}</ol></div>
          </div>
        </div>

        <aside className="rounded-2xl border border-line bg-cloud p-5 sm:p-6"><p className="text-sm font-extrabold text-ink">Besoin d’aide ?</p><p className="mt-2 text-sm leading-6 text-slate-600">Notre équipe peut répondre à vos questions sur la commande, la livraison ou l’installation.</p><Link href="/contact" className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-signal shadow-sm transition hover:bg-signal hover:text-white">Contacter notre équipe</Link><p className="mt-4 text-xs leading-5 text-slate-400">Les dates affichées correspondent aux mises à jour enregistrées. Aucune date de livraison estimée n’est affichée tant qu’elle n’a pas été confirmée.</p></aside>
      </div>
    </section>}
  </main>;
}
