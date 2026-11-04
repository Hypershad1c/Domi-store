import { Homepage } from "@/components/homepage";
import { getPublicProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await getPublicProducts();
  return <Homepage products={products} />;
}
