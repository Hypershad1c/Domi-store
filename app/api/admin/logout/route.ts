import { NextResponse } from "next/server";
import { destroySession } from "@/lib/session";
export async function POST() { try { await destroySession(); } catch {} return NextResponse.json({ ok: true }); }
