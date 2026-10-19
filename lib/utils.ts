export function formatPrice(value: number) { return new Intl.NumberFormat("fr-MA", { maximumFractionDigits: 0 }).format(value) + " DH"; }
export function siteUrl(path = "") { const base = process.env.NEXT_PUBLIC_SITE_URL || ""; return `${base.replace(/\/$/, "")}${path}`; }
export function slugify(value: string) { return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
