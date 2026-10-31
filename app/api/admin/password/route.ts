import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession, getAdmin } from "@/lib/session";
import { runAuditedAdminAction } from "@/lib/admin-audit";

async function changePasswordHandler(request: Request, actor: { id: string; email: string; passwordHash: string }) {
  let body: { targetUserId?: unknown; currentPassword?: unknown; newPassword?: unknown; confirmPassword?: unknown };
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Requête invalide." }, { status: 400 }); }
  if (typeof body !== "object" || body === null) return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  const { targetUserId, currentPassword, newPassword, confirmPassword } = body;
  if (typeof targetUserId !== "string" || !targetUserId) return NextResponse.json({ error: "Sélectionnez un compte administrateur." }, { status: 400 });
  if (typeof newPassword !== "string" || typeof confirmPassword !== "string") return NextResponse.json({ error: "Remplissez les deux champs du nouveau mot de passe." }, { status: 400 });
  if (newPassword.length < 12) return NextResponse.json({ error: "Le nouveau mot de passe doit contenir au moins 12 caractères." }, { status: 400 });
  if (newPassword !== confirmPassword) return NextResponse.json({ error: "Les deux nouveaux mots de passe ne correspondent pas." }, { status: 400 });

  const target = await prisma.adminUser.findUnique({ where: { id: targetUserId } });
  if (!target) return NextResponse.json({ error: "Compte administrateur introuvable." }, { status: 404 });
  const changingOwnPassword = target.id === actor.id;
  if (changingOwnPassword) {
    if (typeof currentPassword !== "string" || !await bcrypt.compare(currentPassword, actor.passwordHash)) return NextResponse.json({ error: "Le mot de passe actuel est incorrect." }, { status: 400 });
  }
  if (await bcrypt.compare(newPassword, target.passwordHash)) return NextResponse.json({ error: "Choisissez un mot de passe différent de celui du compte." }, { status: 400 });

  const nextHash = await bcrypt.hash(newPassword, 12);
  await prisma.$transaction(async (tx) => {
    await tx.adminUser.update({ where: { id: target.id }, data: { passwordHash: nextHash } });
    await tx.session.deleteMany({ where: { adminId: target.id } });
  });
  if (changingOwnPassword) await createSession(actor.id);
  return NextResponse.json({ ok: true, message: changingOwnPassword ? "Votre mot de passe a été mis à jour. Vos autres sessions ont été déconnectées." : `Mot de passe mis à jour pour ${target.email}. Ses sessions ont été déconnectées.` });
}

export async function PATCH(request: Request) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  if (admin.email !== "Anonymous") return NextResponse.json({ error: "Accès réservé à Anonymous." }, { status: 403 });
  const body = await request.clone().json().catch(() => null) as { targetUserId?: unknown } | null;
  const target = typeof body?.targetUserId === "string" ? await prisma.adminUser.findUnique({ where: { id: body.targetUserId }, select: { id: true, email: true } }).catch(() => null) : null;
  return runAuditedAdminAction({
    request,
    admin,
    action: "UPDATE",
    entityType: "Compte administrateur",
    entityId: target?.id,
    entityName: target?.email,
    run: () => changePasswordHandler(request, admin),
  });
}
