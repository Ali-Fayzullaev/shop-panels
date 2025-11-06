import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import { CatalogGrid } from "@/components/CatalogGrid";

export default function CatalogPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header variant="solid" />
      <PageHero
        title="КАТАЛОГ ПРОДУКЦИИ"
        description="Полный каталог декоративных стеновых панелей для внутренней и внешней отделки. Выберите подходящее решение для вашего проекта."
        backgroundImage="/images/wall2.png"
      />
      <main>
        <CatalogGrid />
      </main>
    </div>
  );
}