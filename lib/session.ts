import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
const COOKIE = "domistore_session";
const DAY = 1000 * 60 * 60 * 24;
export async function createSession(adminId: string) { const token = crypto.randomUUID(); await prisma.session.create({ data: { token, adminId, expiresAt: new Date(Date.now() + DAY * 7) } }); const store = await cookies(); store.set(COOKIE, token, { httpOnly: true, secure: true, sameSite: "none", path: "/", maxAge: 60 * 60 * 24 * 7 }); }
export async function getAdmin() { const token = (await cookies()).get(COOKIE)?.value; if (!token) return null; try { const session = await prisma.session.findUnique({ where: { token }, include: { admin: true } }); if (!session || session.expiresAt < new Date()) { if (session) await prisma.session.delete({ where: { id: session.id } }); return null; } return session.admin; } catch { return null; } }
export async function destroySession() { const store = await cookies(); const token = store.get(COOKIE)?.value; if (token) await prisma.session.deleteMany({ where: { token } }); store.delete(COOKIE); }
