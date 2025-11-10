import PageHero from "@/components/PageHero";
import { ProductGrid } from "@/components/ProductGrid";
import { getCategory } from "@/data/types";

export default function FlexiblePage() {
  const category = getCategory("flexible");
  
  if (!category) {
    return <div>атегория не найдена</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <PageHero 
        title={category.name}
        description={category.description}
        backgroundImage="/images/hero-bg.jpg"
      />
      
      <main className="container mx-auto px-4 py-16">
        <ProductGrid products={category.products} categoryId={category.id} />
      </main>
    </div>
  );
}
