import type { Metadata } from "next";
import { DoorCompatibilityChecker } from "@/components/door-compatibility-checker";
import { getPublicProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Trouver une serrure compatible",
  description: "Répondez à quelques questions pour trouver une serrure Domi'Lock adaptée à votre porte et à votre usage.",
};

export default async function CompatibilityPage() {
  const products = await getPublicProducts();
  return (
    <main>
      <section className="border-b border-line bg-cloud py-14 sm:py-20">
        <div className="container-page">
          <p className="eyebrow">Conseil personnalisé</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight text-ink sm:text-6xl">
            Trouvez la serrure adaptée à votre porte.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-500">
            Indiquez quelques détails sur votre porte et vos besoins. Nous vous orienterons vers les modèles à regarder et vous dirons quand une vérification par notre équipe est nécessaire.
          </p>
        </div>
      </section>
      <section className="container-page py-10 sm:py-14">
        <DoorCompatibilityChecker products={products} />
      </section>
    </main>
  );
}
