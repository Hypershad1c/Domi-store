import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin-nav";
import { AdminPasswordForm } from "@/components/admin-password-form";
import { getAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export default async function AdminSecurityPage() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  if (admin.email !== "Anonymous") redirect("/admin");
  const users = await prisma.adminUser.findMany({ select: { id: true, email: true }, orderBy: { email: "asc" } });

  return <main className="flex min-h-screen flex-col bg-[#F5F7FB] lg:flex-row">
    <AdminNav email={admin.email} />
    <section className="min-w-0 flex-1 p-5 sm:p-8 xl:p-10"><div className="mx-auto max-w-5xl">
      <p className="eyebrow">Compte / Sécurité</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Sécurité du compte</h1>
      <p className="mt-2 text-sm text-slate-500">Mettez à jour les identifiants du compte Anonymous.</p>
      <div className="mt-8"><AdminPasswordForm users={users} currentAdminId={admin.id} /></div>
    </div></section>
  </main>;
}
