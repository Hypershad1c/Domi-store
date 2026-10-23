"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Check, ChevronDown, CircleHelp, Ruler, ShieldCheck } from "lucide-react";
import type { Product } from "@/lib/data";
import { ProductCard } from "@/components/product-card";

type Thickness = "under" | "in-range" | "over" | "unknown";
type UseCase = "simple" | "camera" | "face";

const choiceClass = "flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border border-line bg-white px-4 py-3 text-sm font-semibold text-ink transition hover:border-signal has-[:checked]:border-signal has-[:checked]:bg-blue-50";

export function DoorCompatibilityChecker({ products }: { products: Product[] }) {
  const [thickness, setThickness] = useState<Thickness | "">("");
  const [material, setMaterial] = useState("");
  const [useCase, setUseCase] = useState<UseCase | "">("");
  const [showResults, setShowResults] = useState(false);

  const recommendations = useMemo(() => {
    if (!useCase) return [];
    const order: Record<UseCase, string[]> = {
      simple: ["domy-x5-slim", "domy-x5"],
      camera: ["domy-m1-pro", "domy-m24"],
      face: ["domy-m24"],
    };
    return order[useCase]
      .map((slug) => products.find((product) => product.slug === slug))
      .filter((product): product is Product => Boolean(product));
  }, [useCase]);

  const canSubmit = Boolean(thickness && material && useCase);
  const recommendsM24 = recommendations.some((product) => product.slug === "domy-m24");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (canSubmit) setShowResults(true);
  }

  function reset() {
    setThickness("");
    setMaterial("");
    setUseCase("");
    setShowResults(false);
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-start">
      <form onSubmit={submit} className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-8">
        <div className="flex items-start gap-4 border-b border-line pb-5">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-signal"><Ruler size={21} /></span>
          <div>
            <h2 className="text-xl font-extrabold text-ink">À propos de votre porte</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">Ces informations servent à vous orienter. L’installation confirme la compatibilité exacte.</p>
          </div>
        </div>

        <fieldset className="mt-7">
          <legend className="font-extrabold text-ink">1. Quelle est l’épaisseur de la porte ?</legend>
          <p className="mt-1 text-sm text-slate-500">Mesurez le panneau de porte, sans compter les poignées.</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {([["under", "Moins de 35 mm"], ["in-range", "Entre 35 et 120 mm"], ["over", "Plus de 120 mm"], ["unknown", "Je ne sais pas"]] as const).map(([value, label]) => (
              <label className={choiceClass} key={value}>
                <input className="h-4 w-4 accent-signal" type="radio" name="thickness" value={value} checked={thickness === value} onChange={() => { setThickness(value); setShowResults(false); }} />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-7">
          <legend className="font-extrabold text-ink">2. De quel matériau est votre porte ?</legend>
          <p className="mt-1 text-sm text-slate-500">Cela aide notre équipe à préparer la vérification.</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {([["wood", "Bois"], ["metal", "Métal"], ["other", "PVC, vitrée ou autre"]] as const).map(([value, label]) => (
              <label className={choiceClass} key={value}>
                <input className="h-4 w-4 accent-signal" type="radio" name="material" value={value} checked={material === value} onChange={() => { setMaterial(value); setShowResults(false); }} />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-7">
          <legend className="font-extrabold text-ink">3. Quelle fonction compte le plus ?</legend>
          <div className="mt-3 grid gap-2">
            {([["simple", "Empreinte, code et application"], ["camera", "Voir les visiteurs à distance"], ["face", "Reconnaissance faciale"]] as const).map(([value, label]) => (
              <label className={choiceClass} key={value}>
                <input className="h-4 w-4 accent-signal" type="radio" name="useCase" value={value} checked={useCase === value} onChange={() => { setUseCase(value); setShowResults(false); }} />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-7 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center">
          <button type="submit" disabled={!canSubmit} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-signal px-5 py-3 text-sm font-bold text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-50">
            Voir les modèles conseillés <ArrowRight size={17} />
          </button>
          {showResults && <button type="button" onClick={reset} className="min-h-12 rounded-xl px-4 py-3 text-sm font-bold text-slate-500 transition hover:bg-cloud hover:text-ink">Recommencer</button>}
        </div>

        {showResults && <section aria-live="polite" className="mt-7 rounded-2xl border border-blue-100 bg-blue-50/70 p-5 sm:p-6">
          <div className="flex gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-signal"><Check size={20} /></span>
            <div>
              <h3 className="font-extrabold text-ink">Voici les modèles à découvrir</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">La matière de la porte et le mécanisme existant doivent être vérifiés avant de confirmer l’installation.</p>
            </div>
          </div>
          {recommendsM24 && thickness === "in-range" && <p className="mt-4 rounded-xl bg-white p-3 text-sm leading-6 text-emerald-800"><strong>Bonne nouvelle :</strong> l’épaisseur indiquée se trouve dans la plage annoncée pour le Domy M24 (35 à 120 mm). L’installateur vérifiera aussi le type de porte et la serrure existante.</p>}
          {recommendsM24 && (thickness === "under" || thickness === "over") && <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm leading-6 text-amber-900"><strong>À vérifier :</strong> le Domy M24 est annoncé pour des portes de 35 à 120 mm. Votre mesure est en dehors de cette plage ; contactez notre équipe avant de choisir ce modèle.</p>}
          {recommendsM24 && thickness === "unknown" && <p className="mt-4 rounded-xl bg-white p-3 text-sm leading-6 text-slate-600">Une mesure nous aidera à confirmer le Domy M24, annoncé pour les portes de 35 à 120 mm. Si vous ne pouvez pas mesurer, notre équipe peut vous guider.</p>}
          <div className="mt-5 grid gap-4 sm:grid-cols-2">{recommendations.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}</div>
          <Link href="/contact" className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-signal hover:text-ink">Demander une vérification à notre équipe <ArrowRight size={16} /></Link>
        </section>}
      </form>

      <aside className="rounded-2xl border border-line bg-cloud p-5 sm:p-6">
        <div className="flex items-center gap-2 text-sm font-extrabold text-ink"><ShieldCheck className="text-signal" size={19} />Conseil transparent</div>
        <p className="mt-3 text-sm leading-6 text-slate-600">La fiche technique disponible précise l’épaisseur de porte du Domy M24. Pour les autres modèles, notre installateur confirme les dimensions et le mécanisme de votre porte avant la pose.</p>
        <details className="group mt-5 border-t border-line pt-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-bold text-ink"><span className="flex items-center gap-2"><CircleHelp size={17} className="text-signal" />Comment mesurer ?</span><ChevronDown size={16} className="transition group-open:rotate-180" /></summary>
          <p className="mt-3 text-sm leading-6 text-slate-500">Mesurez l’épaisseur du panneau sur le chant de la porte. Une photo de la porte et de la serrure actuelle peut aussi aider notre équipe à vous conseiller.</p>
        </details>
        <Link href="/contact" className="mt-5 inline-flex text-sm font-bold text-signal hover:text-ink">Parler à un conseiller <ArrowRight size={15} className="ml-1" /></Link>
      </aside>
    </div>
  );
}
