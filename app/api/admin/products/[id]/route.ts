import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdmin } from "@/lib/session";
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) { if (!(await getAdmin())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 }); const { id } = await params; await prisma.product.delete({ where: { id } }); return NextResponse.json({ ok: true }); }
