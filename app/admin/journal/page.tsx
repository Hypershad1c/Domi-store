import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAdmin } from "@/lib/session";
import { AdminNav } from "@/components/admin-nav";
import { AdminAuditLogTable } from "@/components/admin-audit-log-table";

export const dynamic = "force-dynamic";

export default async function AdminJournalPage() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");

  const entries = await prisma.adminAuditLog.findMany({ orderBy: { createdAt: "desc" }, take: 300 });
  return <main className="flex min-h-screen flex-col bg-[#F5F7FB] lg:flex-row">
    <AdminNav email={admin.email} />
    <section className="min-w-0 flex-1 p-5 sm:p-8 xl:p-10">
      <div className="mx-auto max-w-7xl">
        <p className="eyebrow">Sécurité & suivi</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Journal d’activité</h1>
        <p className="mt-2 text-sm text-slate-500">Historique des actions et tentatives récentes dans l’administration.</p>
        <div className="mt-8"><AdminAuditLogTable entries={entries} /></div>
      </div>
    </section>
  </main>;
}
