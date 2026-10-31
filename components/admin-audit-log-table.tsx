"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, CircleX, Search } from "lucide-react";

type AuditEntry = {
  id: string;
  adminEmail: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  entityName: string | null;
  success: boolean;
  message: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  device: string | null;
  method: string | null;
  path: string | null;
  createdAt: Date;
};

const actionLabel: Record<string, string> = { CREATE: "Ajout", UPDATE: "Modification", DELETE: "Suppression" };

export function AdminAuditLogTable({ entries }: { entries: AuditEntry[] }) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("all");
  const filtered = useMemo(() => entries.filter((entry) => {
    const text = [entry.adminEmail, entry.action, entry.entityType, entry.entityName, entry.entityId, entry.ipAddress, entry.device, entry.message, entry.path].filter(Boolean).join(" ").toLowerCase();
    return (!query || text.includes(query.toLowerCase())) && (result === "all" || String(entry.success) === result);
  }), [entries, query, result]);
  const date = (value: Date) => new Intl.DateTimeFormat("fr-MA", { timeZone: "Africa/Casablanca", dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
  const event = (entry: AuditEntry) => `${actionLabel[entry.action] || entry.action} · ${entry.entityType}${entry.entityName ? ` · ${entry.entityName}` : ""}`;

  return <div>
    <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-line bg-white p-4 shadow-card sm:flex-row">
      <label className="relative min-w-0 flex-1"><span className="sr-only">Rechercher dans le journal</span><Search className="absolute left-3 top-3 text-slate-400" size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher action, admin, IP…" className="w-full rounded-lg border border-line bg-cloud py-2.5 pl-9 pr-3 text-sm outline-none focus:border-signal" /></label>
      <select value={result} onChange={(e) => setResult(e.target.value)} className="rounded-lg border border-line bg-cloud px-3 py-2.5 text-sm"><option value="all">Tous les résultats</option><option value="true">Réussis</option><option value="false">Échecs</option></select>
      <span className="self-center text-xs font-semibold text-slate-500">{filtered.length} / {entries.length}</span>
    </div>

    <div className="hidden overflow-hidden rounded-2xl border border-line bg-white shadow-card lg:block">
      <div className="overflow-x-auto"><table className="w-full min-w-[1040px] text-left text-sm">
        <thead className="bg-[#FAFBFD] text-[10px] font-extrabold uppercase tracking-wider text-slate-400"><tr><th className="px-4 py-3">Date & heure (Maroc)</th><th className="px-4 py-3">Action</th><th className="px-4 py-3">Résultat</th><th className="px-4 py-3">Admin</th><th className="px-4 py-3">IP</th><th className="px-4 py-3">Appareil</th><th className="px-4 py-3">Détail</th></tr></thead>
        <tbody>{filtered.map((entry) => <tr key={entry.id} className="border-t border-line align-top hover:bg-[#FAFBFD]"><td className="whitespace-nowrap px-4 py-4 text-xs text-slate-500">{date(entry.createdAt)}</td><td className="max-w-[260px] px-4 py-4"><p className="font-bold text-ink">{event(entry)}</p><p className="mt-1 truncate text-[10px] text-slate-400">{entry.method} {entry.path}</p></td><td className="px-4 py-4"><Result success={entry.success} /></td><td className="max-w-[180px] truncate px-4 py-4 text-xs text-slate-600">{entry.adminEmail || "Inconnu"}</td><td className="whitespace-nowrap px-4 py-4 font-mono text-xs text-slate-600">{entry.ipAddress || "Non transmis"}</td><td className="max-w-[190px] px-4 py-4 text-xs text-slate-600"><span title={entry.userAgent || "Agent utilisateur non transmis"}>{entry.device || "Inconnu"}</span></td><td className="max-w-[280px] px-4 py-4 text-xs text-slate-600">{entry.message || "—"}{entry.userAgent && <details className="mt-1"><summary className="cursor-pointer text-[10px] font-semibold text-signal">Détails techniques</summary><p className="mt-1 break-all text-[10px] text-slate-400">{entry.userAgent}</p><p className="mt-1 break-all text-[10px] text-slate-400">ID : {entry.entityId || "—"}</p></details>}</td></tr>)}</tbody>
      </table></div>
      {!filtered.length && <Empty />}
    </div>

    <div className="space-y-3 lg:hidden">{filtered.map((entry) => <article key={entry.id} className="rounded-2xl border border-line bg-white p-4 shadow-card"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="font-bold text-ink">{event(entry)}</p><p className="mt-1 text-xs text-slate-500">{date(entry.createdAt)}</p></div><Result success={entry.success} /></div><div className="mt-3 grid grid-cols-2 gap-3 border-t border-line pt-3 text-xs"><Info label="Admin" value={entry.adminEmail || "Inconnu"} /><Info label="IP" value={entry.ipAddress || "Non transmise"} /><Info label="Appareil" value={entry.device || "Inconnu"} /><Info label="Route" value={`${entry.method || ""} ${entry.path || ""}`} /></div>{entry.message && <p className="mt-3 rounded-lg bg-cloud p-3 text-xs text-slate-600">{entry.message}</p>}<details className="mt-3"><summary className="cursor-pointer text-xs font-semibold text-signal">Détails techniques</summary><p className="mt-2 break-all text-[10px] text-slate-400">ID : {entry.entityId || "—"}<br />{entry.userAgent || "Agent utilisateur non transmis"}</p></details></article>)}{!filtered.length && <Empty />}</div>
    <p className="mt-4 text-xs text-slate-400">Affichage des 300 événements les plus récents. Heure affichée selon le fuseau Africa/Casablanca.</p>
  </div>;
}

function Result({ success }: { success: boolean }) { return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-extrabold ${success ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{success ? <CheckCircle2 size={13} /> : <CircleX size={13} />}{success ? "Réussi" : "Échec"}</span>; }
function Info({ label, value }: { label: string; value: string }) { return <div className="min-w-0"><p className="text-[10px] font-bold uppercase text-slate-400">{label}</p><p className="mt-1 break-words text-slate-600">{value}</p></div>; }
function Empty() { return <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center text-sm text-slate-500">Aucun événement ne correspond à cette recherche.</div>; }
