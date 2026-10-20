import type { Metadata } from "next";
import { OrderTracking } from "@/components/order-tracking";

export const metadata: Metadata = {
  title: "Suivre une commande",
  description: "Consultez le statut de votre commande Domi'Lock avec votre référence et votre téléphone.",
  robots: { index: false, follow: false },
};

export default async function OrderTrackingPage({ searchParams }: { searchParams: Promise<{ reference?: string }> }) {
  const params = await searchParams;
  return <OrderTracking initialReference={params.reference?.slice(0, 100) || ""} />;
}
