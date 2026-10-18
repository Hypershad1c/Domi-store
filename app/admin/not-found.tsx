import { NotFoundState } from "@/components/not-found-state";
export default function AdminNotFound() { return <NotFoundState eyebrow="Administration · 404" title="Cette section admin n'existe pas." description="Utilisez la navigation de l'espace sécurisé pour gérer les produits, commandes et demandes de devis." backHref="/admin" backLabel="Retour au dashboard" />; }
