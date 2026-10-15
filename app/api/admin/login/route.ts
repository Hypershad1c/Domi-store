import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";
export async function POST(request: Request) { const { email, password } = await request.json(); const expectedEmail = process.env.ADMIN_EMAIL || "admin@domistore.ma"; const envHash = process.env.ADMIN_PASSWORD_HASH; if (!envHash || email !== expectedEmail || !(await bcrypt.compare(password, envHash))) return NextResponse.json({ error: "Identifiants incorrects ou administration non configurée." }, { status: 401 }); try { const admin = await prisma.adminUser.upsert({ where: { email }, update: {}, create: { email, passwordHash: envHash } }); await createSession(admin.id); return NextResponse.json({ ok: true }); } catch { return NextResponse.json({ error: "La base de données PostgreSQL n'est pas encore connectée." }, { status: 503 }); } }
