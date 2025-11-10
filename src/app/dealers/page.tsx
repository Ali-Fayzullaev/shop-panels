import type { Metadata } from "next";

import { DealersHero } from "@/components/DealersHero";
import { DealersContent } from "@/components/DealersContent";

export const metadata: Metadata = {
  title: "Дилеры - Стеновые панели",
  description: "Найдите официальных дилеров стеновых панелей в вашем городе. Партнеры по всей России и СНГ с гарантией качества.",
};

export default function DealersPage() {
  return (
    <div className="min-h-screen bg-white">

      <DealersHero />
      <DealersContent />
    </div>
  );
}
