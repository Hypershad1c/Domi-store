import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { orderSchema } from "@/lib/validation";
import { syncOrdersWorkbookToBlob } from "@/lib/orders-export";
import { notifyCustomerOrderCreated, notifyLowStock, notifyOrderCreated } from "@/lib/notifications";
import { lowStockThreshold } from "@/lib/inventory";
export async function POST(request: Request) {
  try {
    let requestBody: unknown;
    try { requestBody = await request.json(); }
    catch { return NextResponse.json({ error: "Le formulaire de commande est invalide." }, { status: 400 }); }
    const parsed = orderSchema.safeParse(requestBody);
    if (!parsed.success) return NextResponse.json({ error: "Informations de commande invalides." }, { status: 400 });
    const { items, idempotencyKey, ...customer } = parsed.data;
    try {
      const existing = await prisma.order.findUnique({ where: { idempotencyKey }, select: { id: true, status: true } });
      if (existing) return NextResponse.json({ ok: true, id: existing.id, status: existing.status, duplicate: true });
    } catch {}
    let valid: { productId: string; quantity: number; name: string; price: number }[];
    try {
      const catalogProducts = await prisma.product.findMany({ where: { id: { in: items.map((item) => item.productId) }, published: true }, select: { id: true, name: true, price: true } });
      const productById = new Map(catalogProducts.map((product) => [product.id, product]));
      const dbItems = items.map((line) => {
        const product = productById.get(line.productId);
        return product ? { ...line, name: product.name, price: product.price } : null;
      });
      if (dbItems.some((item) => item === null)) return NextResponse.json({ error: "Un ou plusieurs produits ne sont plus disponibles." }, { status: 409 });
      valid = dbItems as { productId: string; quantity: number; name: string; price: number }[];
    } catch {
      return NextResponse.json({ error: "Le catalogue est temporairement indisponible." }, { status: 503 });
    }
    const total = valid.reduce((sum, item) => sum + item.price * item.quantity, 0);
    try {
      const stockChanges: { productId: string; name: string; quantity: number; before: number; after: number }[] = [];
      const order = await prisma.$transaction(async (tx) => {
        for (const item of valid) {
          const lockedRows = await tx.$queryRaw<{ stock: number; published: boolean }[]>`SELECT "stock", "published" FROM "Product" WHERE "id" = ${item.productId} FOR UPDATE`;
          const lockedProduct = lockedRows[0];
          const stockBefore = lockedProduct?.stock;
          if (!lockedProduct?.published) throw new Error("PRODUCT_UNAVAILABLE");
          if (stockBefore === undefined) throw new Error("PRODUCT_UNAVAILABLE");
          const deductedQuantity = Math.min(stockBefore, item.quantity);
          const stockAfter = stockBefore - deductedQuantity;
          if (deductedQuantity > 0) {
            await tx.product.update({ where: { id: item.productId }, data: { stock: stockAfter } });
            stockChanges.push({ productId: item.productId, name: item.name, quantity: deductedQuantity, before: stockBefore, after: stockAfter });
          }
        }
        const created = await tx.order.create({ data: { ...customer, customerEmail: customer.customerEmail || null, idempotencyKey, total, note: customer.note || null, items: { create: valid.map((item) => ({ productId: item.productId, name: item.name, price: item.price, quantity: item.quantity })) } } });
        if (stockChanges.length) await tx.inventoryMovement.createMany({ data: stockChanges.map((change) => ({ productId: change.productId, orderId: created.id, quantity: -change.quantity, stockBefore: change.before, stockAfter: change.after, reason: "ORDER" })) });
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
      if (error instanceof Error && error.message === "PRODUCT_UNAVAILABLE") return NextResponse.json({ error: "Un ou plusieurs produits ne sont plus disponibles." }, { status: 409 });
      if (String(error).includes("Unique constraint")) {
        const existing = await prisma.order.findUnique({ where: { idempotencyKey }, select: { id: true, status: true } });
        if (existing) return NextResponse.json({ ok: true, id: existing.id, status: existing.status, duplicate: true });
      }
      return NextResponse.json({ error: "La commande n'a pas pu être enregistrée. La base PostgreSQL est indisponible." }, { status: 503 });
    }
  } catch { return NextResponse.json({ error: "Impossible d'enregistrer la commande." }, { status: 500 }); }
}
