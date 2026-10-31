import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAdmin } from "@/lib/session";
import { AdminNav } from "@/components/admin-nav";
import { ProductHistory } from "@/components/product-history";

export const dynamic = "force-dynamic";

export default async function ProductHistoryPage() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  if (admin.email !== "Anonymous") redirect("/admin");

  const entries = await prisma.adminAuditLog.findMany({ where: { action: "UPDATE", entityType: "Produit", success: true }, orderBy: { createdAt: "desc" }, take: 300 });
  const history = entries.filter((entry) => entry.previousData !== null && entry.newData !== null);

  return <main className="flex min-h-screen flex-col bg-[#F5F7FB] lg:flex-row">
    <AdminNav email={admin.email} />
    <section className="min-w-0 flex-1 p-5 sm:p-8 xl:p-10"><div className="mx-auto max-w-6xl">
      <p className="eyebrow">Catalogue / Versions</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Historique des produits</h1>
      <p className="mt-2 text-sm text-slate-500">Consultez les changements enregistrés avant et après chaque modification.</p>
      <div className="mt-8"><ProductHistory entries={history} /></div>
    </div></section>
  </main>;
}
