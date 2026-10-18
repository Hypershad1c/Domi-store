import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { orderSchema } from "@/lib/validation";
import { products } from "@/lib/data";
import { syncOrdersWorkbookToBlob } from "@/lib/orders-export";

export async function POST(request: Request) {
  try {
    const parsed = orderSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Informations de commande invalides." }, { status: 400 });
    const { items, ...customer } = parsed.data;
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
      const order = await prisma.order.create({ data: { ...customer, total, note: customer.note || null, items: { create: valid.map((item) => ({ productId: item.productId, name: item.name, price: item.price, quantity: item.quantity })) } } });
      await syncOrdersWorkbookToBlob().catch(() => undefined);
      return NextResponse.json({ ok: true, id: order.id, status: order.status });
    } catch {
      return NextResponse.json({ error: "La commande n'a pas pu être enregistrée. La base PostgreSQL est indisponible." }, { status: 503 });
    }
  } catch {
    return NextResponse.json({ error: "Impossible d'enregistrer la commande." }, { status: 500 });
  }
}
