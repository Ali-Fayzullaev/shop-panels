import type { Metadata } from "next";
import { CooperationHero } from "@/components/CooperationHero";
import { CooperationContent } from "@/components/CooperationContent";

export const metadata: Metadata = {
  title: "Сотрудничество - Стеновые панели",
  description: "Станьте нашим партнером! Выгодные условия сотрудничества, поддержка бизнеса и высокая маржинальность. Присоединяйтесь к нашей партнерской программе.",
};

export default function CooperationPage() {
  return (
    <div className="min-h-screen bg-white">
      <CooperationHero />
      <CooperationContent />
    </div>
  );
}
