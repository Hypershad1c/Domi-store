import type { Metadata } from "next";
import { Check, Minus } from "lucide-react";
import { comparisonRows } from "@/lib/data";

export const metadata: Metadata = { title: "Comparatif", description: "Comparez les quatre serrures Domy X5, X5 Slim, M1 Pro et M24." };

const models = [
  { name: "Domy X5", family: "Essentiel" },
  { name: "Domy X5 Slim", family: "Nouveauté" },
  { name: "Domy M1 Pro", family: "Caméra" },
  { name: "Domy M24", family: "Premium Face ID" },
];

export default function Comparatif() {
  return <main>
    <section className="bg-cloud py-12 sm:py-16">
      <div className="container-page">
        <p className="eyebrow">Choisir en confiance</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-6xl">Quatre modèles. <span className="text-signal">Un accès plus simple.</span></h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-slate-500 sm:text-lg sm:leading-8">Une vue claire pour choisir le niveau de technologie adapté à votre porte.</p>
      </div>
    </section>
    <section className="container-page py-8 sm:py-14">
      <div className="space-y-4 lg:hidden">
        {models.map((model, modelIndex) => <article key={model.name} className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
          <header className="bg-ink px-5 py-4 text-white">
            <h2 className="text-lg font-extrabold">{model.name}</h2>
            <p className="mt-0.5 text-xs text-blue-200">{model.family}</p>
          </header>
          <dl className="divide-y divide-line px-5">
            {comparisonRows.map(([label, ...values]) => <div key={label} className="flex items-start justify-between gap-4 py-3">
              <dt className="text-sm font-semibold text-slate-500">{label}</dt>
              <dd className="text-right text-sm font-medium text-ink"><Value value={values[modelIndex]} /></dd>
            </div>)}
          </dl>
        </article>)}
      </div>
      <div className="hidden overflow-x-auto rounded-2xl border border-line bg-white shadow-card lg:block">
        <table className="w-full min-w-[980px] border-separate border-spacing-0 text-left">
          <thead><tr className="bg-ink text-white"><th className="p-5 text-sm">Caractéristique</th>{models.map((model) => <th key={model.name} className="p-5"><span className="block text-lg font-extrabold">{model.name}</span><span className="text-xs font-normal text-blue-200">{model.family}</span></th>)}</tr></thead>
          <tbody>{comparisonRows.map(([label, ...values]) => <tr key={label} className="even:bg-cloud"><th scope="row" className="border-b border-line p-5 text-sm font-bold">{label}</th>{values.map((value, index) => <td key={`${label}-${index}`} className="border-b border-line p-5 text-sm text-slate-600"><Value value={value} /></td>)}</tr>)}</tbody>
        </table>
      </div>
    </section>
  </main>;
}

function Value({ value }: { value: string }) {
  if (value === "—") return <Minus size={16} className="text-slate-300" />;
  if (value === "Oui") return <span className="inline-flex items-center gap-2"><Check size={16} className="text-signal" />Oui</span>;
  return value;
}
