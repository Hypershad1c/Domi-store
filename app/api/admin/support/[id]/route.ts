import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdmin } from "@/lib/session";
import { supportStatusSchema } from "@/lib/validation";
import { runAuditedAdminAction } from "@/lib/admin-audit";

async function updateSupportHandler(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdmin())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  let body: { status?: unknown };
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Requête invalide." }, { status: 400 }); }
  if (typeof body !== "object" || body === null) return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  const parsed = supportStatusSchema.safeParse(body.status);
  if (!parsed.success) return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
  try {
    const ticket = await prisma.supportRequest.update({ where: { id: (await params).id }, data: { status: parsed.data } });
    return NextResponse.json(ticket);
  } catch {
    return NextResponse.json({ error: "Demande SAV introuvable." }, { status: 404 });
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await context.params;
  const ticket = await prisma.supportRequest.findUnique({ where: { id }, select: { customerName: true } }).catch(() => null);
  return runAuditedAdminAction({ request, admin, action: "UPDATE", entityType: "Demande SAV", entityId: id, entityName: ticket?.customerName, run: () => updateSupportHandler(request, context) });
}
