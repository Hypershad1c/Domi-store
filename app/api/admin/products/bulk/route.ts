import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdmin } from "@/lib/session";
export async function PATCH(request: Request) { if (!(await getAdmin())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 }); const body = await request.json() as { ids?: string[]; published?: boolean }; if (!Array.isArray(body.ids) || !body.ids.length || typeof body.published !== "boolean") return NextResponse.json({ error: "Sélection ou statut invalide" }, { status: 400 }); await prisma.product.updateMany({ where: { id: { in: body.ids } }, data: { published: body.published } }); return NextResponse.json({ ok: true, count: body.ids.length }); }
