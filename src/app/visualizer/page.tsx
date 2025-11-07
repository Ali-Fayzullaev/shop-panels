import type { Metadata } from "next";
import Header from "@/components/Header";
import { VisualizerHero } from "@/components/VisualizerHero";
import { VisualizerContent } from "@/components/VisualizerContent";

export const metadata: Metadata = {
  title: "Визуализатор - Стеновые панели",
  description: "Интерактивный визуализатор стеновых панелей. Попробуйте разные цвета и посмотрите как панели будут выглядеть в интерьере.",
};

export default function VisualizerPage() {
  return (
    <div className="h-[59vh] lg:min-h-screen bg-white">
      <Header />
      <VisualizerContent />
    </div>
  );
}