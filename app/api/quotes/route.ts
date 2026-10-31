import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { quoteSchema } from "@/lib/validation";

export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Formulaire invalide." }, { status: 400 }); }
  const parsed = quoteSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Veuillez vérifier les champs du formulaire." }, { status: 400 });
  try {
    const quote = await prisma.quoteRequest.create({ data: parsed.data });
    return NextResponse.json({ ok: true, id: quote.id });
  } catch {
    return NextResponse.json({ error: "La demande n’a pas pu être enregistrée. Réessayez dans quelques instants." }, { status: 503 });
  }
}
