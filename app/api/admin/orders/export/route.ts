import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/session";
import { getOrdersWorkbookBuffer } from "@/lib/orders-export";

export async function GET() {
  if (!(await getAdmin())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const buffer = await getOrdersWorkbookBuffer();
    return new NextResponse(buffer as BodyInit, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="domistore-commandes.xlsx"',
        "Cache-Control": "no-store"
      }
    });
  } catch {
    return NextResponse.json({ error: "Impossible de générer le fichier Excel. Vérifiez PostgreSQL." }, { status: 503 });
  }
}
