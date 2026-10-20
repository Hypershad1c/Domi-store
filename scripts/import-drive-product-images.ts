import { randomUUID } from "node:crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const folders = [
  { slug: "domy-m1-pro", folderId: "1FpCRtJrfC606Y87aSJ_WuiqGfBGbFhcd" },
  { slug: "domy-m24", folderId: "1YhIHJeANsF6a_Yy2no4D611k_N-jC9Y2" },
  { slug: "domy-x5", folderId: "1ng9LjQ-NOG0cCiDes-EANnKV_L8f5fb4" },
  { slug: "domy-x5-slim", folderId: "1e6Y8tgJqPL228mZlCpWT-jMj_FoBhd93" },
];

type DriveImage = { id: string; name: string };

function decodeHtml(value: string) {
  return value.replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}

async function listImages(folderId: string): Promise<DriveImage[]> {
  const response = await fetch(`https://drive.google.com/embeddedfolderview?id=${folderId}#list`);
  if (!response.ok) throw new Error(`Could not read Drive folder (${response.status}).`);
  const html = await response.text();
  const files: DriveImage[] = [];
  const entryPattern = /id="entry-([^"]+)"[\s\S]*?href="https:\/\/drive\.google\.com\/(?:drive\/)?file\/d\/([^"]+)"[\s\S]*?flip-entry-title">([\s\S]*?)<\/div>/g;

  for (const match of html.matchAll(entryPattern)) {
    const name = decodeHtml(match[3].replace(/<[^>]*>/g, "").trim());
    if (/\.(png|jpe?g|webp|gif)$/i.test(name)) files.push({ id: match[2].split("/")[0], name });
  }
  return files;
}

function detectImageType(bytes: Uint8Array) {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (bytes[0] === 0x89 && Buffer.from(bytes.slice(1, 4)).toString() === "PNG") return "image/png";
  if (Buffer.from(bytes.slice(0, 4)).toString() === "RIFF" && Buffer.from(bytes.slice(8, 12)).toString() === "WEBP") return "image/webp";
  if (Buffer.from(bytes.slice(0, 3)).toString() === "GIF") return "image/gif";
  return null;
}

async function main() {
  for (const folder of folders) {
    const product = await prisma.product.findUnique({ where: { slug: folder.slug }, select: { id: true, name: true } });
    if (!product) throw new Error(`Product slug not found in PostgreSQL: ${folder.slug}. Run the project seed first.`);

    const files = await listImages(folder.folderId);
    if (!files.length) throw new Error(`No image files found in Drive folder for ${product.name}.`);

    const images = [];
    for (const file of files) {
      const response = await fetch(`https://drive.google.com/uc?export=download&id=${file.id}`);
      if (!response.ok) throw new Error(`Could not download ${file.name} (${response.status}).`);
      const data = new Uint8Array(await response.arrayBuffer());
      const contentType = detectImageType(data);
      if (!contentType) throw new Error(`Drive returned a non-image file for ${file.name}.`);
      if (data.byteLength > 15 * 1024 * 1024) throw new Error(`${file.name} exceeds the 15 MiB per-image limit.`);

      const id = randomUUID();
      images.push({
        id,
        productId: product.id,
        url: `/api/product-images/${id}`,
        alt: `${product.name} — ${file.name}`,
        data,
        contentType,
        sortOrder: images.length,
        isPrimary: images.length === 0,
      });
    }

    await prisma.$transaction([
      prisma.productImage.deleteMany({ where: { productId: product.id } }),
      prisma.productImage.createMany({ data: images }),
    ]);
    const totalMiB = images.reduce((total, image) => total + image.data.byteLength, 0) / (1024 * 1024);
    console.log(`${product.name}: imported ${images.length} images (${totalMiB.toFixed(1)} MiB).`);
  }
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : "Drive image import failed.");
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
