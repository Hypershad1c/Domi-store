type OrderNotice = { id: string; customerName?: string; customerEmail?: string | null; total?: number; status?: string };

const statusLabels: Record<string, string> = { NEW: "reçue", CONFIRMED: "confirmée", SHIPPED: "expédiée", DELIVERED: "livrée", CANCELLED: "annulée" };

async function sendEmail(to: string, subject: string, text: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: process.env.NOTIFICATION_FROM_EMAIL || "domiStore <onboarding@resend.dev>", to: [to], subject, text }),
  });
  if (!response.ok) throw new Error(`Email delivery failed (${response.status}).`);
}

function trackingUrl(orderId: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return `${siteUrl.replace(/\/$/, "")}/suivi-commande?reference=${encodeURIComponent(orderId)}`;
}

export async function notifyOrderCreated(order: OrderNotice) {
  const to = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL;
  if (!to) return;
  await sendEmail(to, `Nouvelle commande domiStore #${order.id}`, `Une nouvelle commande a été enregistrée.\nClient : ${order.customerName || "—"}\nTotal : ${order.total || 0} DH\nStatut : Nouvelle\n\nOuvrir l'administration : ${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/admin/commandes`);
}

export async function notifyCustomerOrderCreated(order: OrderNotice) {
  if (!order.customerEmail) return;
  await sendEmail(order.customerEmail, `Commande reçue — domiStore #${order.id}`, `Bonjour ${order.customerName || ""},\n\nNous avons bien reçu votre commande de ${order.total || 0} DH. Notre équipe la vérifiera et vous contactera pour la confirmer.\n\nSuivre votre commande : ${trackingUrl(order.id)}\nRéférence : ${order.id}\n\nL'équipe domiStore`);
}

export async function notifyOrderStatusChanged(order: OrderNotice, previousStatus: string) {
  const nextLabel = statusLabels[order.status || ""] || order.status || "mise à jour";
  const previousLabel = statusLabels[previousStatus] || previousStatus;
  const message = `Le statut de la commande ${order.id} est passé de « ${previousLabel} » à « ${nextLabel} ».`;
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL;
  const sends: Promise<void>[] = [];
  if (adminEmail) sends.push(sendEmail(adminEmail, `Commande domiStore #${order.id} — ${nextLabel}`, `${message}\n\nOuvrir l'administration : ${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/admin/commandes`));
  if (order.customerEmail) sends.push(sendEmail(order.customerEmail, `Mise à jour de votre commande #${order.id}`, `${order.customerName ? `Bonjour ${order.customerName},\n\n` : ""}${message}\n\nSuivre votre commande : ${trackingUrl(order.id)}\n\nL'équipe domiStore`));
  await Promise.allSettled(sends);
}

export async function notifyLowStock(product: { name: string; stock: number; threshold: number }) {
  const to = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL;
  if (!to) return;
  await sendEmail(to, `Stock faible — ${product.name}`, `${product.name} vient de passer à ${product.stock} unité(s).\nSeuil d'alerte : ${product.threshold}.\n\nMettre à jour le stock : ${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/admin/inventaire`);
}
