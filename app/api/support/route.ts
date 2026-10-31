import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { supportRequestSchema } from "@/lib/validation";
export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Formulaire invalide." }, { status: 400 }); }
  const parsed = supportRequestSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Merci de vérifier les informations saisies." }, { status: 400 });
  try {
    const ticket = await prisma.supportRequest.create({ data: { ...parsed.data, orderRef: parsed.data.orderRef || null, model: parsed.data.model || null, preferredTime: parsed.data.preferredTime || null } });
    return NextResponse.json({ ok: true, id: ticket.id });
  } catch { return NextResponse.json({ error: "Le service est temporairement indisponible. Réessayez dans quelques instants." }, { status: 503 }); }
}
