import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession, getAdmin } from "@/lib/session";
import { runAuditedAdminAction } from "@/lib/admin-audit";

async function changePasswordHandler(request: Request, adminId: string, passwordHash: string) {
  let body: { currentPassword?: unknown; newPassword?: unknown; confirmPassword?: unknown };
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Requête invalide." }, { status: 400 }); }
  if (typeof body !== "object" || body === null) return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  const { currentPassword, newPassword, confirmPassword } = body;
  if (typeof currentPassword !== "string" || typeof newPassword !== "string" || typeof confirmPassword !== "string") {
    return NextResponse.json({ error: "Remplissez les trois champs du formulaire." }, { status: 400 });
  }
  if (!await bcrypt.compare(currentPassword, passwordHash)) return NextResponse.json({ error: "Le mot de passe actuel est incorrect." }, { status: 400 });
  if (newPassword.length < 12) return NextResponse.json({ error: "Le nouveau mot de passe doit contenir au moins 12 caractères." }, { status: 400 });
  if (newPassword !== confirmPassword) return NextResponse.json({ error: "Les deux nouveaux mots de passe ne correspondent pas." }, { status: 400 });
  if (await bcrypt.compare(newPassword, passwordHash)) return NextResponse.json({ error: "Choisissez un mot de passe différent de l’actuel." }, { status: 400 });

  const nextHash = await bcrypt.hash(newPassword, 12);
  await prisma.$transaction(async (tx) => {
    await tx.adminUser.update({ where: { id: adminId }, data: { passwordHash: nextHash } });
    await tx.session.deleteMany({ where: { adminId } });
  });
  await createSession(adminId);
  return NextResponse.json({ ok: true, message: "Mot de passe mis à jour. Les autres sessions ont été déconnectées." });
}

export async function PATCH(request: Request) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  if (admin.email !== "Anonymous") return NextResponse.json({ error: "Accès réservé à Anonymous." }, { status: 403 });
  return runAuditedAdminAction({
    request,
    admin,
    action: "UPDATE",
    entityType: "Compte administrateur",
    entityName: "Anonymous",
    run: () => changePasswordHandler(request, admin.id, admin.passwordHash),
  });
}
