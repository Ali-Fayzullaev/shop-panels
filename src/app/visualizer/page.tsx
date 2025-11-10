import type { Metadata } from "next";
import { VisualizerContent } from "@/components/VisualizerContent";

export const metadata: Metadata = {
  title: "Визуализатор - Стеновые панели",
  description: "Интерактивный визуализатор стеновых панелей. Попробуйте разные цвета и посмотрите как панели будут выглядеть в интерьере.",
};

export default function VisualizerPage() {
  return (
    <div className=" lg:min-h-screen bg-white">
      <VisualizerContent />
    </div>
  );
}
