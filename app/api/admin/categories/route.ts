import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdmin } from "@/lib/session";
import { getOrCreateCategory } from "@/lib/categories";
import { runAuditedAdminAction } from "@/lib/admin-audit";
export async function GET() { if (!(await getAdmin())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 }); return NextResponse.json(await prisma.category.findMany({ orderBy: { name: "asc" } })); }
async function createCategoryHandler(request: Request) {
  if (!(await getAdmin())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  let body: unknown;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Requête invalide." }, { status: 400 }); }
  const name = typeof body === "object" && body !== null && "name" in body ? body.name : undefined;
  if (typeof name !== "string" || name.trim().length < 2) return NextResponse.json({ error: "Le nom doit contenir au moins deux caractères." }, { status: 400 });

  const normalizedName = name.trim();
  const existing = await prisma.category.findUnique({ where: { name: normalizedName } });
  if (existing) return NextResponse.json(existing, { status: 200 });
  return NextResponse.json(await getOrCreateCategory(normalizedName), { status: 201 });
}

export async function POST(request: Request) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  return runAuditedAdminAction({ request, admin, action: "CREATE", entityType: "Catégorie", run: () => createCategoryHandler(request) });
}
