import ExcelJS from "exceljs";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";

export async function buildOrdersWorkbook() {
  const orders = await prisma.order.findMany({ include: { items: true }, orderBy: { createdAt: "desc" } });
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "domiStore";
  workbook.created = new Date();
  const sheet = workbook.addWorksheet("Commandes");
  sheet.columns = [
    { header: "ID", key: "id", width: 28 },
    { header: "Date", key: "createdAt", width: 22 },
    { header: "Client", key: "customerName", width: 24 },
    { header: "Téléphone", key: "phone", width: 18 },
    { header: "Ville", key: "city", width: 18 },
    { header: "Adresse", key: "address", width: 34 },
    { header: "Produits", key: "items", width: 58 },
    { header: "Total DH", key: "total", width: 14 },
    { header: "Statut", key: "status", width: 16 },
    { header: "Remarque", key: "note", width: 36 }
  ];
  const header = sheet.getRow(1);
  header.font = { bold: true, color: { argb: "FFFFFFFF" } };
  header.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0F1F4D" } };
  header.alignment = { vertical: "middle" };
  for (const order of orders) {
    sheet.addRow({
      id: order.id,
      createdAt: order.createdAt.toLocaleString("fr-MA"),
      customerName: order.customerName,
      phone: order.phone,
      city: order.city,
      address: order.address,
      items: order.items.map((item) => `${item.name} × ${item.quantity}`).join(" | "),
      total: order.total,
      status: order.status,
      note: order.note || ""
    });
  }
  sheet.getColumn("total").numFmt = '#,##0 "DH"';
  sheet.views = [{ state: "frozen", ySplit: 1 }];
  sheet.autoFilter = { from: "A1", to: "J1" };
  return workbook;
}

export async function getOrdersWorkbookBuffer() {
  const workbook = await buildOrdersWorkbook();
  return workbook.xlsx.writeBuffer();
}

export async function syncOrdersWorkbookToBlob() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return false;
  const buffer = await getOrdersWorkbookBuffer();
  await put("exports/domistore-commandes.xlsx", buffer, {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    cacheControlMaxAge: 60
  });
  return true;
}
