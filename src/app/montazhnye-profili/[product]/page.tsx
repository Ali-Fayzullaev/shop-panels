import { notFound } from "next/navigation";
import { getProduct, getCategory } from "@/data/types";
import { ProductPageContent } from "@/components/ProductPageContent";

interface ProductPageProps {
  params: Promise<{ product: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { product: productId } = await params;
  const product = getProduct("montazhnye-profili", productId);
  const category = getCategory("montazhnye-profili");

  if (!product || !category) {
    notFound();
  }

  return <ProductPageContent product={product} category={category} />;
}

export async function generateStaticParams() {
  const category = getCategory("montazhnye-profili");
  
  if (!category) {
    return [];
  }

  return category.products.map((product) => ({
    product: product.id,
  }));
}