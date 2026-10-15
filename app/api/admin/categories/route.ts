import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdmin } from "@/lib/session";
export async function GET() { if (!(await getAdmin())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 }); return NextResponse.json(await prisma.category.findMany({ orderBy: { name: "asc" } })); }
export async function POST(request: Request) { if (!(await getAdmin())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 }); const { name } = await request.json(); if (typeof name !== "string" || name.trim().length < 2) return NextResponse.json({ error: "Nom invalide" }, { status: 400 }); const slug = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-"); return NextResponse.json(await prisma.category.create({ data: { name: name.trim(), slug } }), { status: 201 }); }
