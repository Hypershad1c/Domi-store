import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { quoteSchema } from "@/lib/validation";
export async function POST(request: Request) { const parsed = quoteSchema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: "Veuillez vérifier les champs du formulaire." }, { status: 400 }); try { const quote = await prisma.quoteRequest.create({ data: parsed.data }); return NextResponse.json({ ok: true, id: quote.id }); } catch { return NextResponse.json({ ok: true, demo: true }); } }
