"use client";

import { useState } from "react";
import { LoaderCircle } from "lucide-react";

const statuses = [
  { value: "NEW", label: "À confirmer" },
  { value: "CONFIRMED", label: "Confirmée" },
  { value: "SHIPPED", label: "Expédiée" },
  { value: "DELIVERED", label: "Livrée" },
  { value: "CANCELLED", label: "Annulée" },
];

const styleByStatus: Record<string, string> = {
  NEW: "bg-amber-50 text-amber-800",
  CONFIRMED: "bg-blue-50 text-blue-800",
  SHIPPED: "bg-violet-50 text-violet-800",
  DELIVERED: "bg-emerald-50 text-emerald-800",
  CANCELLED: "bg-red-50 text-red-800",
};

export function OrderStatus({ id, initial }: { id: string; initial: string }) {
  const [status, setStatus] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function change(value: string) {
    const previous = status;
    setStatus(value);
    setSaving(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/orders/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: value }) });
      if (!response.ok) throw new Error("Impossible de sauvegarder");
    } catch {
      setStatus(previous);
      setError("Échec de l’enregistrement");
    } finally {
      setSaving(false);
    }
  }

  return <div className="flex flex-col items-start gap-1.5">
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 ${styleByStatus[status] || "bg-cloud text-slate-600"}`}>
      {saving && <LoaderCircle size={12} className="animate-spin" />}
      <select aria-label="Statut de la commande" disabled={saving} value={status} onChange={(event) => change(event.target.value)} className="cursor-pointer appearance-none bg-transparent text-[11px] font-extrabold outline-none disabled:cursor-wait">
        {statuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
      </select>
    </span>
    {error && <span className="text-[10px] font-semibold text-red-600" role="alert">{error}</span>}
  </div>;
}
