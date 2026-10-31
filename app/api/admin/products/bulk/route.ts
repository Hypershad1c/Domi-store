import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdmin } from "@/lib/session";
import { runAuditedAdminAction } from "@/lib/admin-audit";

async function bulkUpdateHandler(request: Request) {
  if (!(await getAdmin())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  let body: { ids?: string[]; published?: boolean };
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Requête invalide." }, { status: 400 }); }
  if (typeof body !== "object" || body === null) return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  if (!Array.isArray(body.ids) || !body.ids.length || typeof body.published !== "boolean") return NextResponse.json({ error: "Sélection ou statut invalide" }, { status: 400 });
  const result = await prisma.product.updateMany({ where: { id: { in: body.ids } }, data: { published: body.published } });
  return NextResponse.json({ ok: true, count: result.count, name: body.published ? "Publication groupée" : "Dépublication groupée" });
}

export async function PATCH(request: Request) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  return runAuditedAdminAction({ request, admin, action: "UPDATE", entityType: "Produits groupés", run: () => bulkUpdateHandler(request) });
}
