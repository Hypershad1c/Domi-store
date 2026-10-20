import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/session";
import { AdminNav } from "@/components/admin-nav";
import AdminProductsClient from "./admin-products-client";

export default async function AdminProductsPage() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");

  return <main className="flex min-h-screen flex-col bg-[#F5F7FB] lg:flex-row">
    <AdminNav email={admin.email} />
    <section className="min-w-0 flex-1 bg-[#F5F7FB]">
      <AdminProductsClient />
    </section>
  </main>;
}
