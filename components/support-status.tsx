"use client";

import { useState } from "react";
import { LoaderCircle } from "lucide-react";

const statuses = [
  { value: "NEW", label: "Nouvelle" },
  { value: "IN_PROGRESS", label: "En cours" },
  { value: "RESOLVED", label: "Résolue" },
  { value: "CLOSED", label: "Clôturée" },
];

const styleByStatus: Record<string, string> = {
  NEW: "bg-amber-50 text-amber-800",
  IN_PROGRESS: "bg-blue-50 text-blue-800",
  RESOLVED: "bg-emerald-50 text-emerald-800",
  CLOSED: "bg-cloud text-slate-600",
};

export function SupportStatus({ id, initial }: { id: string; initial: string }) {
  const [status, setStatus] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function change(value: string) {
    const previous = status;
    setStatus(value);
    setSaving(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/support/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: value }) });
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
      <select aria-label="Statut de la demande SAV" disabled={saving} value={status} onChange={(event) => change(event.target.value)} className="cursor-pointer appearance-none bg-transparent text-[11px] font-extrabold outline-none disabled:cursor-wait">
        {statuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
      </select>
    </span>
    {error && <span className="text-[10px] font-semibold text-red-600" role="alert">{error}</span>}
  </div>;
}
