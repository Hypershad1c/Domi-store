"use client";

type HistoryEntry = {
  id: string;
  adminEmail: string | null;
  entityName: string | null;
  entityId: string | null;
  createdAt: Date;
  previousData: unknown;
  newData: unknown;
};

const labels: Record<string, string> = {
  name: "Nom", slug: "Slug", category: "Gamme", price: "Prix", compareAt: "Prix barré", shortDesc: "Description courte",
  description: "Description", features: "Caractéristiques", stock: "Stock", published: "Publication", featured: "Mise en avant",
  hasCamera: "Caméra", faceId: "Face ID", images: "Images",
};

function asRecord(value: unknown): Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value) ? value as Record<string, unknown> : {}; }
function valueText(value: unknown) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Oui" : "Non";
  if (Array.isArray(value)) return value.length ? value.join(" · ") : "Aucun";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export function ProductHistory({ entries }: { entries: HistoryEntry[] }) {
  const date = (value: Date) => new Intl.DateTimeFormat("fr-MA", { timeZone: "Africa/Casablanca", dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
  return entries.length ? <div className="space-y-3">{entries.map((entry) => {
    const before = asRecord(entry.previousData);
    const after = asRecord(entry.newData);
    const keys = [...new Set([...Object.keys(before), ...Object.keys(after)])].filter((key) => JSON.stringify(before[key]) !== JSON.stringify(after[key]));
    return <details key={entry.id} className="group rounded-2xl border border-line bg-white shadow-card">
      <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-4 p-4 sm:p-5"><div className="min-w-0"><p className="truncate font-extrabold text-ink">{entry.entityName || String(after.name || "Produit")}</p><p className="mt-1 text-xs text-slate-500">{date(entry.createdAt)} · {entry.adminEmail || "Admin inconnu"}</p></div><span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-signal">{keys.length} champ{keys.length === 1 ? "" : "s"} modifié{keys.length === 1 ? "" : "s"}</span></summary>
      <div className="space-y-3 border-t border-line p-4 sm:p-5">{keys.map((key) => <div key={key} className="grid gap-2 rounded-xl bg-[#FAFBFD] p-3 sm:grid-cols-[150px_1fr_1fr] sm:gap-4"><p className="text-xs font-extrabold text-ink">{labels[key] || key}</p><div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Avant</p><p className="mt-1 whitespace-pre-wrap break-words text-xs leading-5 text-slate-600">{valueText(before[key])}</p></div><div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-wide text-signal">Après</p><p className="mt-1 whitespace-pre-wrap break-words text-xs leading-5 text-slate-700">{valueText(after[key])}</p></div></div>)}{!keys.length && <p className="text-sm text-slate-500">Aucune différence de champ détectée.</p>}<p className="text-[10px] text-slate-400">ID produit : {entry.entityId || "—"}</p></div>
    </details>;
  })}</div> : <div className="rounded-2xl border border-dashed border-line bg-white p-12 text-center"><p className="font-bold text-ink">Aucun historique pour le moment</p><p className="mt-2 text-sm text-slate-500">Les prochaines modifications de produits apparaîtront ici.</p></div>;
}
