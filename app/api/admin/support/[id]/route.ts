import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdmin } from "@/lib/session";
import { supportStatusSchema } from "@/lib/validation";
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) { if (!(await getAdmin())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 }); const parsed = supportStatusSchema.safeParse((await request.json()).status); if (!parsed.success) return NextResponse.json({ error: "Statut invalide" }, { status: 400 }); try { const ticket = await prisma.supportRequest.update({ where: { id: (await params).id }, data: { status: parsed.data } }); return NextResponse.json(ticket); } catch { return NextResponse.json({ error: "Demande SAV introuvable." }, { status: 404 }); } }
