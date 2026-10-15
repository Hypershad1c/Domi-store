import type { Metadata } from "next";
import { CheckoutForm } from "@/components/forms";
export const metadata: Metadata = { title: "Panier et commande", description: "Finalisez votre commande domiStore avec paiement à la livraison." };
export default function Panier() { return <main><section className="bg-cloud py-14"><div className="container-page"><p className="eyebrow">Dernière étape</p><h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">Votre commande, <span className="text-signal">sans surprise.</span></h1><p className="mt-4 text-slate-500">Livraison, installation et paiement à la livraison.</p></div></section><section className="container-page max-w-3xl py-12"><CheckoutForm /></section></main>; }
