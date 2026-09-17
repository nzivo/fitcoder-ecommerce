import { notFound } from "next/navigation";
import ProductDetail from "@/components/shop/ProductDetail";
import { getProductBySlug, getProductVariants } from "@/lib/data";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const variants = await getProductVariants(product.id);

  return <ProductDetail product={product} variants={variants} />;
}
