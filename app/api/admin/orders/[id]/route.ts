import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdmin } from "@/lib/session";
import { orderStatusSchema } from "@/lib/validation";
import { syncOrdersWorkbookToBlob } from "@/lib/orders-export";
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) { if (!(await getAdmin())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 }); const parsed = orderStatusSchema.safeParse((await request.json()).status); if (!parsed.success) return NextResponse.json({ error: "Statut invalide" }, { status: 400 }); const { id } = await params; try { const order = await prisma.order.update({ where: { id }, data: { status: parsed.data } }); await syncOrdersWorkbookToBlob().catch(() => undefined); return NextResponse.json(order); } catch { return NextResponse.json({ error: "Commande introuvable ou base PostgreSQL indisponible." }, { status: 503 }); } }
