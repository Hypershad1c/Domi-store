"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, CheckCircle2, Clock3, PackageCheck, Search, Truck, XCircle } from "lucide-react";
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
  { status: "NEW", label: "Commande reçue", detail: "Votre commande est enregistrée.", icon: CheckCircle2 },
  { status: "CONFIRMED", label: "Confirmée", detail: "Notre équipe a confirmé votre commande.", icon: Check },
  { status: "SHIPPED", label: "Expédiée", detail: "Votre commande est en cours de livraison.", icon: Truck },
  { status: "DELIVERED", label: "Livrée", detail: "Votre commande a été livrée.", icon: PackageCheck },
];

const statusLabels: Record<string, string> = {
  NEW: "En attente de confirmation",
  CONFIRMED: "Confirmée",
  SHIPPED: "Expédiée",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
};

function formatDate(value: string) {
  return new Date(value).toLocaleString("fr-MA", { dateStyle: "medium", timeStyle: "short" });
}

export function OrderTracking({ initialReference = "" }: { initialReference?: string }) {
  const [reference, setReference] = useState(initialReference);
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<TrackingOrder | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setOrder(null);
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

  const currentStep = order ? steps.findIndex((step) => step.status === order.status) : -1;

  return <main>
    <section className="grid-lines border-b border-line py-14 sm:py-20">
      <div className="container-page">
        <p className="eyebrow">Suivi de commande</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl">Où en est votre commande ?</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-500">Saisissez la référence reçue après votre commande et le numéro de téléphone utilisé lors de l'achat.</p>
        <form onSubmit={submit} className="mt-8 grid gap-4 rounded-2xl border border-line bg-white p-5 shadow-card sm:grid-cols-[1fr_1fr_auto] sm:items-end sm:p-6">
          <label className="block text-sm font-semibold">Référence de commande<input required minLength={12} maxLength={100} value={reference} onChange={(event) => setReference(event.target.value)} placeholder="Ex. cm..." autoComplete="off" className="mt-2 w-full rounded-xl border border-line bg-cloud px-3 py-3 font-mono text-sm outline-none focus:border-signal" /></label>
          <label className="block text-sm font-semibold">Téléphone de la commande<input required minLength={8} maxLength={30} type="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="06 00 00 00 00" className="mt-2 w-full rounded-xl border border-line bg-cloud px-3 py-3 outline-none focus:border-signal" /></label>
          <button disabled={loading} className="flex items-center justify-center gap-2 rounded-xl bg-signal px-5 py-3 text-sm font-bold text-white transition hover:bg-ink disabled:opacity-60">{loading ? <Clock3 size={17} className="animate-spin" /> : <Search size={17} />}{loading ? "Recherche…" : "Voir le suivi"}</button>
        </form>
        {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>}
      </div>
    </section>

    {order && <section className="container-page py-10 sm:py-14" aria-live="polite">
      <div className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-8">
        <div className="flex flex-col justify-between gap-4 border-b border-line pb-5 sm:flex-row sm:items-start">
          <div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Référence</p><p className="mt-1 break-all font-mono text-sm font-bold">{order.id}</p><p className="mt-2 text-sm text-slate-500">Commande passée le {formatDate(order.createdAt)}</p></div>
          <span className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-2 text-sm font-bold ${order.status === "CANCELLED" ? "bg-red-50 text-red-700" : order.status === "DELIVERED" ? "bg-mint text-emerald-700" : "bg-blue-50 text-signal"}`}>
            {order.status === "CANCELLED" ? <XCircle size={16} /> : <PackageCheck size={16} />}{statusLabels[order.status] || "Statut mis à jour"}
          </span>
        </div>

        {order.status === "CANCELLED" ? <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm leading-6 text-red-800">Cette commande a été annulée. Contactez notre équipe si vous souhaitez plus d'informations.</div> : <div className="mt-8 grid gap-5 sm:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const complete = currentStep >= index;
            return <div key={step.status} className="relative flex gap-3 sm:block">
              {index < steps.length - 1 && <span className={`absolute left-[17px] top-10 h-[calc(100%-8px)] w-0.5 sm:left-10 sm:top-[18px] sm:h-0.5 sm:w-[calc(100%-24px)] ${currentStep > index ? "bg-signal" : "bg-line"}`} />}
              <span className={`relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full ${complete ? "bg-signal text-white" : "bg-cloud text-slate-400"}`}><Icon size={17} /></span>
              <div className="pb-5 sm:pb-0 sm:pt-3"><p className={`text-sm font-bold ${complete ? "text-ink" : "text-slate-400"}`}>{step.label}</p><p className="mt-1 text-xs leading-5 text-slate-500">{step.detail}</p></div>
            </div>;
          })}
        </div>}

        <div className="mt-8 grid gap-8 border-t border-line pt-6 md:grid-cols-[1fr_.8fr]">
          <div><h2 className="font-extrabold">Articles commandés</h2><ul className="mt-3 divide-y divide-line">{order.items.map((item, index) => <li key={`${item.name}-${index}`} className="flex justify-between gap-4 py-3 text-sm"><span>{item.name} <span className="text-slate-400">× {item.quantity}</span></span><span className="shrink-0 font-semibold">{formatPrice(item.price * item.quantity)}</span></li>)}</ul><p className="mt-3 flex justify-between border-t border-line pt-4 font-extrabold"><span>Total</span><span>{formatPrice(order.total)}</span></p></div>
          <div><h2 className="font-extrabold">Mises à jour</h2><ol className="mt-3 space-y-3">{[{ status: "NEW", createdAt: order.createdAt }, ...order.history].map((entry, index) => <li key={`${entry.status}-${entry.createdAt}-${index}`} className="flex gap-3 text-sm"><span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-mint text-emerald-700"><Check size={12} /></span><span><span className="font-semibold">{statusLabels[entry.status || ""] || "Mise à jour"}</span><span className="mt-0.5 block text-xs text-slate-400">{formatDate(entry.createdAt)}</span></span></li>)}</ol></div>
        </div>
      </div>
      <p className="mt-6 text-center text-sm text-slate-500">Une question ? <Link href="/contact" className="font-bold text-signal hover:underline">Contactez notre équipe</Link>.</p>
    </section>}
  </main>;
}
