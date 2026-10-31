import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdmin } from "@/lib/session";
import { orderStatusSchema } from "@/lib/validation";
import { syncOrdersWorkbookToBlob } from "@/lib/orders-export";
import { notifyOrderStatusChanged } from "@/lib/notifications";
import { runAuditedAdminAction } from "@/lib/admin-audit";
async function updateOrderStatusHandler(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  let body: { status?: unknown };
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Requête invalide." }, { status: 400 }); }
  if (typeof body !== "object" || body === null) return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  const parsed = orderStatusSchema.safeParse(body.status);
  if (!parsed.success) return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
  const { id } = await params;
  try {
    const result = await prisma.$transaction(async (tx) => {
      const lockedOrder = await tx.$queryRaw<{ id: string }[]>`SELECT "id" FROM "Order" WHERE "id" = ${id} FOR UPDATE`;
      if (!lockedOrder.length) return { kind: "missing" as const };
      const current = await tx.order.findUnique({ where: { id }, select: { status: true } });
      if (!current) return { kind: "missing" as const };
      if (current.status === parsed.data) return { kind: "unchanged" as const, status: current.status };
      if (current.status === "CANCELLED") return { kind: "blocked" as const };

      const updated = await tx.order.update({ where: { id }, data: { status: parsed.data } });
      if (parsed.data === "CANCELLED") {
        const orderMovements = await tx.inventoryMovement.findMany({ where: { orderId: id, reason: "ORDER", quantity: { lt: 0 } }, select: { productId: true, quantity: true } });
        const quantities = new Map<string, number>();
        for (const movement of orderMovements) quantities.set(movement.productId, (quantities.get(movement.productId) || 0) - movement.quantity);
        for (const [productId, quantity] of quantities) {
          if (quantity <= 0) continue;
          const lockedProduct = await tx.$queryRaw<{ stock: number }[]>`SELECT "stock" FROM "Product" WHERE "id" = ${productId} FOR UPDATE`;
          const stockBefore = lockedProduct[0]?.stock;
          if (stockBefore === undefined) continue;
          const stockAfter = stockBefore + quantity;
          await tx.product.update({ where: { id: productId }, data: { stock: stockAfter } });
          await tx.inventoryMovement.create({ data: { productId, orderId: id, quantity, stockBefore, stockAfter, reason: "ORDER_CANCELLATION" } });
        }
      }
      await tx.orderAudit.create({ data: { orderId: id, adminId: admin.id, action: "STATUS_CHANGED", fromStatus: current.status, toStatus: parsed.data } });
      return { kind: "updated" as const, order: updated, fromStatus: current.status };
    });

    if (result.kind === "missing") return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
    if (result.kind === "blocked") return NextResponse.json({ error: "Une commande annulée ne peut pas être réactivée." }, { status: 409 });
    if (result.kind === "unchanged") return NextResponse.json({ id, status: result.status });
    await syncOrdersWorkbookToBlob().catch(() => undefined);
    await notifyOrderStatusChanged({ id: result.order.id, status: result.order.status, customerName: result.order.customerName, customerEmail: result.order.customerEmail }, result.fromStatus).catch(() => undefined);
    return NextResponse.json(result.order);
  } catch { return NextResponse.json({ error: "Impossible de sauvegarder le statut." }, { status: 503 }); }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await context.params;
  const order = await prisma.order.findUnique({ where: { id }, select: { customerName: true } }).catch(() => null);
  return runAuditedAdminAction({ request, admin, action: "UPDATE", entityType: "Commande", entityId: id, entityName: order?.customerName, run: () => updateOrderStatusHandler(request, context) });
}
