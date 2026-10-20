import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const image = await prisma.productImage.findUnique({
      where: { id: (await params).id },
      select: { data: true, contentType: true },
    });

    if (!image?.data || !image.contentType) {
      return new Response("Image not found", { status: 404 });
    }

    return new Response(Buffer.from(image.data), {
      headers: {
        "Content-Type": image.contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Image unavailable", { status: 503 });
  }
}
