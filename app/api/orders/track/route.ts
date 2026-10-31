import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { orderTrackingSchema } from "@/lib/validation";

const lookupAttempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;

function normalizePhone(value: string) {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("00212")) digits = `0${digits.slice(5)}`;
  else if (digits.startsWith("212") && digits.length === 12) digits = `0${digits.slice(3)}`;
  return digits;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Veuillez vérifier la référence et le téléphone saisis." }, { status: 400 });
  }

  const parsed = orderTrackingSchema.safeParse(body);
  if (!parsed.success || normalizePhone(parsed.data.phone).length < 8) {
    return NextResponse.json({ error: "Veuillez vérifier la référence et le téléphone saisis." }, { status: 400 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const attempts = lookupAttempts.get(ip);
  if (attempts && attempts.resetAt > now && attempts.count >= MAX_ATTEMPTS) {
    return NextResponse.json({ error: "Trop de recherches. Réessayez dans quelques minutes." }, { status: 429 });
  }
  if (!attempts || attempts.resetAt <= now) lookupAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  else lookupAttempts.set(ip, { ...attempts, count: attempts.count + 1 });

  try {
    const order = await prisma.order.findUnique({
      where: { id: parsed.data.reference.toLowerCase() },
      select: {
        id: true,
        phone: true,
        status: true,
        total: true,
        createdAt: true,
        items: { select: { name: true, quantity: true, price: true } },
        auditLogs: {
          where: { action: "STATUS_CHANGED" },
          orderBy: { createdAt: "asc" },
          select: { toStatus: true, createdAt: true }
        }
      }
    });

    if (!order || normalizePhone(order.phone) !== normalizePhone(parsed.data.phone)) {
      return NextResponse.json({ error: "Aucune commande trouvée. Vérifiez la référence et le téléphone utilisés lors de la commande." }, { status: 404 });
    }

    return NextResponse.json({
      id: order.id,
      status: order.status,
      total: order.total,
      createdAt: order.createdAt,
      items: order.items,
      history: order.auditLogs.filter((entry) => entry.toStatus).map((entry) => ({ status: entry.toStatus, createdAt: entry.createdAt }))
    });
  } catch {
    return NextResponse.json({ error: "Le suivi est temporairement indisponible. Réessayez plus tard." }, { status: 503 });
  }
}
