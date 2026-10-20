import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { orderSchema } from "@/lib/validation";
import { products } from "@/lib/data";
import { syncOrdersWorkbookToBlob } from "@/lib/orders-export";
import { notifyCustomerOrderCreated, notifyLowStock, notifyOrderCreated } from "@/lib/notifications";
import { lowStockThreshold } from "@/lib/inventory";
export async function POST(request: Request) {
  try {
    const parsed = orderSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Informations de commande invalides." }, { status: 400 });
    const { items, idempotencyKey, ...customer } = parsed.data;
    try {
      const existing = await prisma.order.findUnique({ where: { idempotencyKey }, select: { id: true, status: true } });
      if (existing) return NextResponse.json({ ok: true, id: existing.id, status: existing.status, duplicate: true });
    } catch {}
    const dbItems = await Promise.all(items.map(async (line) => {
      try {
        const product = await prisma.product.findUnique({ where: { id: line.productId } });
        return product ? { ...line, name: product.name, price: product.price } : null;
      } catch {
        const product = products.find((item) => item.id === line.productId);
        return product ? { ...line, name: product.name, price: product.price } : null;
      }
    }));
    const valid = dbItems.filter(Boolean) as { productId: string; quantity: number; name: string; price: number }[];
    if (!valid.length) return NextResponse.json({ error: "Produit introuvable." }, { status: 400 });
    const total = valid.reduce((sum, item) => sum + item.price * item.quantity, 0);
    try {
      const stockChanges: { productId: string; name: string; quantity: number; before: number; after: number }[] = [];
      const order = await prisma.$transaction(async (tx) => {
        for (const item of valid) {
          const lockedRows = await tx.$queryRaw<{ stock: number }[]>`SELECT "stock" FROM "Product" WHERE "id" = ${item.productId} FOR UPDATE`;
          const stockBefore = lockedRows[0]?.stock;
          if (stockBefore === undefined || stockBefore < item.quantity) throw new Error("STOCK_INSUFFICIENT");
          const stockAfter = stockBefore - item.quantity;
          await tx.product.update({ where: { id: item.productId }, data: { stock: stockAfter } });
          stockChanges.push({ productId: item.productId, name: item.name, quantity: item.quantity, before: stockBefore, after: stockAfter });
        }
        const created = await tx.order.create({ data: { ...customer, customerEmail: customer.customerEmail || null, idempotencyKey, total, note: customer.note || null, items: { create: valid.map((item) => ({ productId: item.productId, name: item.name, price: item.price, quantity: item.quantity })) } } });
        await tx.inventoryMovement.createMany({ data: stockChanges.map((change) => ({ productId: change.productId, orderId: created.id, quantity: -change.quantity, stockBefore: change.before, stockAfter: change.after, reason: "ORDER" })) });
        return created;
      });
      await syncOrdersWorkbookToBlob().catch(() => undefined);
      await Promise.all([
        notifyOrderCreated({ id: order.id, customerName: order.customerName, total: order.total }),
        notifyCustomerOrderCreated({ id: order.id, customerName: order.customerName, customerEmail: order.customerEmail, total: order.total }),
        ...stockChanges.filter((change) => change.before > lowStockThreshold && change.after <= lowStockThreshold).map((change) => notifyLowStock({ name: change.name, stock: change.after, threshold: lowStockThreshold })),
      ].map((notification) => notification.catch(() => undefined)));
      return NextResponse.json({ ok: true, id: order.id, status: order.status });
    } catch (error) {
      if (error instanceof Error && error.message === "STOCK_INSUFFICIENT") return NextResponse.json({ error: "Un ou plusieurs produits ne sont plus disponibles dans la quantité demandée." }, { status: 409 });
      if (String(error).includes("Unique constraint")) {
        const existing = await prisma.order.findUnique({ where: { idempotencyKey }, select: { id: true, status: true } });
        if (existing) return NextResponse.json({ ok: true, id: existing.id, status: existing.status, duplicate: true });
      }
      return NextResponse.json({ error: "La commande n'a pas pu être enregistrée. La base PostgreSQL est indisponible." }, { status: 503 });
    }
  } catch { return NextResponse.json({ error: "Impossible d'enregistrer la commande." }, { status: 500 }); }
}
