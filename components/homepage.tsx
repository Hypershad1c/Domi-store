"use client";

import { Accordion, Card, Tabs } from "@heroui/react";
import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Check,
  ChevronRight,
  Fingerprint,
  Headphones,
  KeyRound,
  LockKeyhole,
  MapPin,
  Plus,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Truck,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Product } from "@/lib/data";
import { HeroRouteLink as Link } from "@/components/hero-route-link";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";

export function Homepage({ products }: { products: Product[] }) {
  const [productFilter, setProductFilter] = useState("all");
  const productFilters = [
    { id: "all", label: "Tous les modèles", products },
    { id: "essential", label: "Essentiels", products: products.filter((product) => !product.hasCamera && !product.faceId) },
    { id: "video", label: "Vidéo", products: products.filter((product) => product.hasCamera && !product.faceId) },
    { id: "face", label: "Face ID", products: products.filter((product) => product.faceId) },
  ];
  const activeFilter = productFilters.find((filter) => filter.id === productFilter) ?? productFilters[0];
  const featured = products.find((product) => product.slug === "domy-x5-slim") ?? products[0];

  return (
    <main className="overflow-hidden bg-cloud">
      <section className="hero-night relative isolate overflow-hidden border-b border-white/10 text-white">
        <div className="container-page relative z-10 flex flex-col items-center pb-14 pt-28 text-center sm:pb-20 sm:pt-32 lg:pb-24 lg:pt-36">
          <Reveal className="flex max-w-4xl flex-col items-center">
            <div className="mb-6 flex flex-wrap items-center justify-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-signal"><Sparkles size={17} /></span>
              <span className="text-[11px] font-extrabold uppercase tracking-[.18em] text-blue-200">Domi&rsquo;Lock &middot; Acc&egrave;s intelligent</span>
              <span className="rounded-full bg-accent px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[.1em] text-ink">Installation offerte</span>
            </div>
            <h1 className="max-w-4xl text-[clamp(3rem,8vw,7rem)] font-extrabold leading-[.92] tracking-[-.065em] text-white">
              L&rsquo;acc&egrave;s &agrave; votre maison, <span className="text-signal">r&eacute;invent&eacute;.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/65 sm:text-lg sm:leading-8">
              La bonne serrure connect&eacute;e rend chaque entr&eacute;e plus simple. Choisissez votre mod&egrave;le et notre &eacute;quipe s&rsquo;occupe de l&rsquo;installation.
            </p>
            <div className="mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
              <Link href="#collection" className="button button--primary button--lg no-underline inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-extrabold text-ink shadow-[0_10px_34px_rgba(244,41,2,.3)] transition hover:-translate-y-1 hover:bg-[#db2400]">
                Voir les mod&egrave;les <ArrowRight size={17} />
              </Link>
              <Link href="/compatibilite" className="button button--secondary button--lg no-underline inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-bold text-white transition hover:-translate-y-1 hover:bg-white/15">
                Ma porte est-elle compatible ? <ArrowUpRight size={16} />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.12} className="relative mt-14 w-full max-w-5xl sm:mt-16">
            <div className="absolute -inset-x-10 bottom-8 top-8 rounded-full bg-signal/20 blur-3xl" />
            <div className="absolute -left-4 top-[18%] z-20 h-16 w-16 rounded-full border-[8px] border-accent sm:-left-8 sm:h-24 sm:w-24" />
            <Card className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 p-2 shadow-[0_35px_110px_rgba(0,0,0,.4)] backdrop-blur sm:rounded-[2.5rem] sm:p-3">
              <div className="relative overflow-hidden rounded-[1.5rem] bg-[#F4F9FF] sm:rounded-[2rem]">
                <img src={featured?.images[0] || "/products/domy-x5-slim.jpg"} alt={`Serrure connect\u00e9e ${featured?.name || "Domi'Lock"}`} className="h-[310px] w-full object-contain p-5 sm:h-[440px] sm:p-8 lg:h-[500px]" />
                <div className="absolute inset-x-0 bottom-0 flex flex-col items-start justify-between gap-3 bg-gradient-to-t from-ink/90 via-ink/55 to-transparent p-5 pt-20 text-left text-white sm:flex-row sm:items-end sm:p-8 sm:pt-28">
                  <div><p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-blue-200">La nouvelle g&eacute;n&eacute;ration</p><p className="mt-1 text-2xl font-extrabold tracking-tight sm:text-4xl">{featured?.name || "Domy X5 Slim"}</p><p className="mt-1 text-xs text-white/75 sm:text-sm">Empreinte, code et application. &Agrave; vous de choisir.</p></div>
                  {featured && <span className="rounded-xl bg-white px-4 py-2.5 text-sm font-extrabold text-ink">{featured.price.toLocaleString("fr-MA")} DH</span>}
                </div>
              </div>
            </Card>
            <div className="absolute -right-2 top-8 z-20 flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2.5 text-xs font-bold text-ink shadow-card sm:-right-6 sm:top-12 sm:px-4 sm:py-3">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-signal/10 text-signal"><Fingerprint size={17} /></span>
              Ouverture par empreinte
            </div>
            <div className="absolute -bottom-4 left-4 z-20 flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2.5 text-xs font-bold text-ink shadow-card sm:bottom-7 sm:left-8 sm:px-4 sm:py-3">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent/20 text-ink"><ShieldCheck size={17} /></span>
              Pose par nos &eacute;quipes
            </div>
          </Reveal>
          <div className="mt-11 flex flex-wrap justify-center gap-x-8 gap-y-3 text-xs font-semibold text-white/65 sm:text-sm">
            <span className="flex items-center gap-2"><Check size={15} className="text-signal" /> Paiement &agrave; la livraison</span>
            <span className="flex items-center gap-2"><Check size={15} className="text-signal" /> Garantie jusqu&rsquo;&agrave; 5 ans</span>
          </div>
        </div>
      </section>

      <section id="collection" className="scroll-mt-24 bg-white py-16 sm:py-20 lg:py-24">
        <div className="container-page">
          <Reveal className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">La collection</p>
              <h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">Trouvez la serrure qui vous ressemble.</h2>
            </div>
            <Link href="/boutique" className="inline-flex items-center gap-2 text-sm font-extrabold text-signal transition hover:gap-3">Toute la boutique <ArrowRight size={16} /></Link>
          </Reveal>
          {products.length ? (
            <Tabs selectedKey={productFilter} onSelectionChange={(key) => setProductFilter(String(key))} className="mt-8 w-full lg:mt-10">
              <Tabs.ListContainer>
                <Tabs.List aria-label="Filtrer la collection" className="w-full overflow-x-auto sm:w-fit">
                  {productFilters.map((filter) => <Tabs.Tab key={filter.id} id={filter.id} className="gap-2 whitespace-nowrap">
                    {filter.label}<span className="rounded-full bg-cloud px-2 py-0.5 text-[10px]">{filter.products.length}</span><Tabs.Indicator />
                  </Tabs.Tab>)}
                </Tabs.List>
              </Tabs.ListContainer>
              <Tabs.Panel id={activeFilter.id} className="mt-5">
                {activeFilter.products.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {activeFilter.products.map((product, index) => <ProductCard product={product} index={index} key={product.id} />)}
                </div> : <p className="rounded-2xl border border-line bg-cloud p-8 text-center text-sm text-slate-500">Aucun modèle dans cette catégorie pour le moment.</p>}
              </Tabs.Panel>
            </Tabs>
          ) : (
            <p className="mt-8 rounded-2xl border border-line bg-cloud p-8 text-center text-sm text-slate-500">La collection sera bientôt disponible.</p>
          )}
        </div>
      </section>

      <section className="border-y border-line bg-cloud py-7 sm:py-9">
        <div className="container-page grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <TrustItem icon={ShieldCheck} title="Garantie jusqu’à 5 ans" detail="Pour acheter sereinement" />
          <TrustItem icon={Truck} title="Livraison offerte" detail="Dans nos zones d’intervention" />
          <TrustItem icon={Wrench} title="Pose par nos équipes" detail="Installation incluse" />
          <TrustItem icon={Headphones} title="Conseil humain" detail="Avant et après l’achat" />
        </div>
      </section>

      <section className="container-page py-16 sm:py-20 lg:py-24">
        <div className="grid overflow-hidden rounded-[2rem] bg-ink text-white shadow-soft lg:grid-cols-[.95fr_1.05fr]">
          <Reveal className="relative flex min-h-[340px] items-center overflow-hidden p-7 sm:p-10 lg:p-12">
            <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full border border-white/10" />
            <div className="absolute -left-5 -top-5 h-44 w-44 rounded-full border border-white/10" />
            <div className="absolute bottom-8 right-8 h-24 w-24 rounded-full bg-accent/90 blur-[1px]" />
            <div className="absolute bottom-14 right-14 grid h-28 w-28 place-items-center rounded-full bg-signal text-white shadow-[0_0_80px_rgba(0,153,255,.35)] sm:h-36 sm:w-36">
              <LockKeyhole size={46} strokeWidth={1.4} />
            </div>
            <div className="relative z-10 max-w-xs">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[.15em] text-blue-200"><Sparkles size={13} /> Le confort au quotidien</span>
              <p className="mt-6 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">Une entrée plus intelligente commence ici.</p>
            </div>
          </Reveal>
          <div className="grid content-center gap-3 bg-[#F4F9FF] p-6 text-ink sm:p-9 lg:p-12">
            <FeatureRow icon={Fingerprint} title="Entrez comme vous voulez" detail="Empreinte, code, carte, clé ou application selon le modèle." />
            <FeatureRow icon={Smartphone} title="Gardez le contrôle" detail="Gérez vos accès simplement, à la maison ou à distance." />
            <FeatureRow icon={KeyRound} title="Gardez l’esprit tranquille" detail="Des solutions conçues pour être simples à utiliser tous les jours." />
            <Link href="/comparatif" className="mt-3 inline-flex w-fit items-center gap-2 rounded-xl bg-signal px-4 py-3 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-ink">Comparer les modèles <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      <section className="section-wash border-y border-line py-16 sm:py-20 lg:py-24">
        <div className="container-page">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Simple du début à la fin</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">Trois étapes. Une porte qui vous simplifie la vie.</h2>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-3 lg:mt-14">
            <Step number="01" icon={MapPin} title="Parlez-nous de votre porte" text="Vérifiez la compatibilité ou demandez conseil à notre équipe avant de choisir." />
            <Step number="02" icon={LockKeyhole} title="Choisissez votre modèle" text="Comparez les fonctionnalités et trouvez le niveau d’accès qui vous convient." />
            <Step number="03" icon={Wrench} title="On s’occupe de la pose" text="Nous livrons, installons et vous accompagnons pour la prise en main." />
          </div>
          <div className="mt-8 text-center"><Link href="/compatibilite" className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-5 py-3 text-sm font-bold text-ink transition hover:border-signal hover:text-signal">Vérifier la compatibilité de ma porte <ChevronRight size={16} /></Link></div>
        </div>
      </section>

      <section className="container-page py-16 sm:py-20 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:items-center">
          <Reveal>
            <p className="eyebrow">Pensé pour vos projets</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Une serrure pour votre maison. Une solution pour tout votre projet.</h2>
            <p className="mt-4 leading-7 text-slate-600">Résidence, location saisonnière, hôtel ou programme immobilier : nous vous aidons à choisir le bon modèle et le bon volume.</p>
            <Link href="/espace-pro" className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-signal transition hover:gap-3">Découvrir l’espace Pro <ArrowRight size={16} /></Link>
          </Reveal>
          <div className="grid gap-3 sm:grid-cols-2">
            <ProjectCard icon={Building2} title="Résidences" detail="Équipez un appartement ou plusieurs logements." />
            <ProjectCard icon={KeyRound} title="Locations" detail="Simplifiez l’arrivée et la gestion des accès." />
            <ProjectCard icon={ShieldCheck} title="Hôtellerie" detail="Un accueil pratique pour vos équipes et vos clients." />
            <ProjectCard icon={Headphones} title="Accompagnement" detail="Un interlocuteur pour le conseil et l’installation." />
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-[#F4F9FF] py-16 sm:py-20 lg:py-24">
        <div className="container-page grid gap-10 lg:grid-cols-[.7fr_1.3fr] lg:gap-16">
          <Reveal>
            <p className="eyebrow">Vos questions, simplement</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Avant de choisir, prenez vos rep&egrave;res.</h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-slate-600">Compatibilit&eacute;, installation ou choix du mod&egrave;le : retrouvez les r&eacute;ponses utiles pour avancer sereinement.</p>
            <Link href="/contact" className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-signal transition hover:gap-3">Une autre question ? Contactez-nous <ArrowRight size={16} /></Link>
          </Reveal>
          <Accordion variant="default" hideSeparator className="rounded-2xl border border-line bg-white px-5 shadow-card sm:px-7">
            <FaqItem id="installation" question="La livraison et l’installation sont-elles incluses ?">
              La livraison et la pose sont offertes dans nos zones d’intervention. Notre équipe confirme les détails avec vous avant l’installation.
            </FaqItem>
            <FaqItem id="compatibilite" question="Comment savoir si la serrure convient à ma porte ?">
              Utilisez notre vérification de compatibilité ou envoyez-nous les mesures de votre porte. Nous vous aidons à confirmer le modèle avant votre commande.
            </FaqItem>
            <FaqItem id="modele" question="Quel modèle choisir pour mon logement ?">
              Le X5 Slim couvre les accès essentiels. Le M1 Pro ajoute la vidéo, tandis que le M24 propose la reconnaissance faciale. Comparez les modèles selon votre usage.
            </FaqItem>
            <FaqItem id="paiement" question="Puis-je payer à la livraison ?">
              Oui. Le paiement à la livraison est disponible pour les commandes confirmées par notre équipe.
            </FaqItem>
          </Accordion>
        </div>
      </section>

      <section className="container-page pb-16 sm:pb-20 lg:pb-24">
        <div className="grid gap-4 rounded-[2rem] border border-line bg-white p-6 shadow-card sm:grid-cols-[1fr_auto] sm:items-center sm:p-9">
          <div><p className="eyebrow">Besoin d’un conseil ?</p><h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">On vous aide à choisir la bonne serrure.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Dites-nous comment vous utilisez votre porte. Notre équipe vous orientera vers le modèle adapté.</p></div>
            <Link href="/contact" className="button button--primary button--lg no-underline inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3.5 text-sm font-extrabold text-ink shadow-[0_8px_24px_rgba(244,41,2,.18)] transition hover:-translate-y-0.5 hover:bg-[#db2400]">Parler à un conseiller <ArrowRight size={16} /></Link>
        </div>
      </section>
    </main>
  );
}

function TrustItem({ icon: Icon, title, detail }: { icon: LucideIcon; title: string; detail: string }) {
  return <div className="flex items-center gap-3 rounded-2xl border border-line/80 bg-white p-4 shadow-sm sm:border-0 sm:bg-transparent sm:p-2 sm:shadow-none">
    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-signal/10 text-signal"><Icon size={20} /></span>
    <span><span className="block text-sm font-extrabold text-ink">{title}</span><span className="mt-0.5 block text-xs text-slate-500">{detail}</span></span>
  </div>;
}

function FeatureRow({ icon: Icon, title, detail }: { icon: LucideIcon; title: string; detail: string }) {
  return <Card className="flex-row items-start gap-4 rounded-2xl border border-line bg-white p-4 shadow-none sm:p-5">
    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-signal/10 text-signal"><Icon size={20} /></span>
    <span><span className="block font-extrabold">{title}</span><span className="mt-1 block text-sm leading-6 text-slate-500">{detail}</span></span>
  </Card>;
}

function Step({ number, icon: Icon, title, text }: { number: string; icon: LucideIcon; title: string; text: string }) {
  return <Card className="group relative overflow-hidden rounded-2xl border border-line bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft sm:p-7">
    <div className="flex items-center justify-between"><span className="text-xs font-extrabold tracking-[.18em] text-signal">ÉTAPE {number}</span><span className="grid h-11 w-11 place-items-center rounded-xl bg-cloud text-ink transition group-hover:bg-accent"><Icon size={20} /></span></div>
    <h3 className="mt-7 text-xl font-extrabold tracking-tight text-ink">{title}</h3>
    <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
    <span className="absolute -bottom-10 -right-3 text-8xl font-black tracking-tighter text-signal/[.04]">{number}</span>
  </Card>;
}

function ProjectCard({ icon: Icon, title, detail }: { icon: LucideIcon; title: string; detail: string }) {
  return <Card className="group rounded-2xl border border-line bg-white p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:border-signal/40 hover:shadow-soft sm:p-6">
    <span className="grid h-11 w-11 place-items-center rounded-xl bg-cloud text-signal transition group-hover:bg-signal group-hover:text-white"><Icon size={20} /></span>
    <h3 className="mt-5 font-extrabold text-ink">{title}</h3>
    <p className="mt-2 text-sm leading-6 text-slate-500">{detail}</p>
  </Card>;
}

function FaqItem({ id, question, children }: { id: string; question: string; children: string }) {
  return <Accordion.Item id={id} className="border-b border-line last:border-b-0">
    <Accordion.Heading>
      <Accordion.Trigger className="flex w-full items-center justify-between gap-4 py-5 text-left text-sm font-extrabold text-ink transition hover:text-signal sm:text-base">
        <span>{question}</span>
        <Accordion.Indicator className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-cloud text-signal transition-colors"><Plus size={17} /></Accordion.Indicator>
      </Accordion.Trigger>
    </Accordion.Heading>
    <Accordion.Panel>
      <Accordion.Body className="max-w-2xl pb-5 text-sm leading-7 text-slate-600">{children}</Accordion.Body>
    </Accordion.Panel>
  </Accordion.Item>;
}
