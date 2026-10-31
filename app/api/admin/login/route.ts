import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";

const attempts = new Map<string, { count: number; resetAt: number }>();

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const current = attempts.get(ip);
  if (current && current.resetAt > now && current.count >= 5) return NextResponse.json({ error: "Trop de tentatives. Réessayez dans quelques minutes." }, { status: 429 });
  if (current && current.resetAt <= now) attempts.delete(ip);

  let body: { email?: unknown; password?: unknown };
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Requête invalide." }, { status: 400 }); }
  if (typeof body !== "object" || body === null) return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  const identifier = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const expectedEmail = process.env.ADMIN_EMAIL || "admin@domistore.ma";
  const envHash = process.env.ADMIN_PASSWORD_HASH;

  try {
    let admin: { id: string; email: string } | null = null;
    const accountEmail = identifier.toLowerCase() === "anonymous" ? "Anonymous" : identifier;
    const candidate = accountEmail ? await prisma.adminUser.findUnique({ where: { email: accountEmail } }) : null;
    if (candidate && await bcrypt.compare(password, candidate.passwordHash)) {
      admin = candidate;
    } else if (!candidate && identifier === expectedEmail && envHash && await bcrypt.compare(password, envHash)) {
      admin = await prisma.adminUser.upsert({ where: { email: identifier }, update: {}, create: { email: identifier, passwordHash: envHash } });
    }

    if (!admin) {
      const previous = attempts.get(ip);
      attempts.set(ip, { count: (previous?.count || 0) + 1, resetAt: now + 15 * 60 * 1000 });
      return NextResponse.json({ error: "Identifiants incorrects ou administration non configurée." }, { status: 401 });
    }
    attempts.delete(ip);
    await createSession(admin.id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "La base de données PostgreSQL n'est pas encore connectée." }, { status: 503 });
  }
}
