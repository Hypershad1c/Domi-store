import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getAdmin } from "@/lib/session";
export const runtime = "nodejs";
export async function POST(request: Request) { if (!(await getAdmin())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 }); const form = await request.formData(); const file = form.get("file"); if (!(file instanceof File)) return NextResponse.json({ error: "Fichier manquant" }, { status: 400 }); if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "Image invalide (5 Mo maximum)." }, { status: 400 }); if (!process.env.BLOB_READ_WRITE_TOKEN) return NextResponse.json({ error: "BLOB_READ_WRITE_TOKEN n'est pas configuré." }, { status: 503 }); const blob = await put(`products/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`, file, { access: "public", addRandomSuffix: false }); return NextResponse.json({ url: blob.url }); }
