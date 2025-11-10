import PageHero from "@/components/PageHero";
import { ProductGrid } from "@/components/ProductGrid";
import productsData from "@/data/products.json";
import type { Category } from "@/data/types";

export default function SalePage() {
  const breadcrumbs = [
    { label: "Главная", href: "/" },
    { label: "Каталог", href: "/catalog" },
    { label: "Акции и скидки" }
  ];

  // Получаем данные категории из JSON
  const categoryData = productsData.categories["sale"] as Category;

  return (
    <div className="min-h-screen bg-white">
      <PageHero 
        title={categoryData.name}
        description={categoryData.description}
        backgroundImage={categoryData.image}
        breadcrumbs={breadcrumbs}
      />
      
      <ProductGrid 
        products={categoryData.products}
        categoryId="sale"
      />
    </div>
  );
}