import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdmin } from "@/lib/session";
import { orderStatusSchema } from "@/lib/validation";
import { syncOrdersWorkbookToBlob } from "@/lib/orders-export";
import { notifyOrderStatusChanged } from "@/lib/notifications";
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const parsed = orderStatusSchema.safeParse((await request.json()).status);
  if (!parsed.success) return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
  const { id } = await params;
  try {
    const current = await prisma.order.findUnique({ where: { id }, select: { status: true, customerName: true, customerEmail: true } });
    if (!current) return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
    if (current.status === parsed.data) return NextResponse.json({ id, status: current.status });
    const order = await prisma.$transaction(async (tx) => {
      const updated = await tx.order.update({ where: { id }, data: { status: parsed.data } });
      await tx.orderAudit.create({ data: { orderId: id, adminId: admin.id, action: "STATUS_CHANGED", fromStatus: current.status, toStatus: parsed.data } });
      return updated;
    });
    await syncOrdersWorkbookToBlob().catch(() => undefined);
    await notifyOrderStatusChanged({ id: order.id, status: order.status, customerName: order.customerName, customerEmail: order.customerEmail }, current.status).catch(() => undefined);
    return NextResponse.json(order);
  } catch { return NextResponse.json({ error: "Impossible de sauvegarder le statut." }, { status: 503 }); }
}
