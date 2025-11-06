import Header from "@/components/Header";
import Hero from "@/components/Hero";
import { InteriorCarousel } from "@/components/InteriorCarousel";
import { CatalogGrid } from "@/components/CatalogGrid";
import { FeaturesGrid } from "@/components/FeaturesGrid";
import { ConsultationSection } from "@/components/ConsultationSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <main>
        <div className="py-12">
          <InteriorCarousel />
        </div>
        <CatalogGrid />
        <FeaturesGrid />
        <ConsultationSection />
      </main>
    </div>
  );
}
