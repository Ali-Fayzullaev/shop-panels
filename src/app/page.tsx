import Header from "@/components/Header";
import { InteriorCarousel } from "@/components/InteriorCarousel";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-12">
        <InteriorCarousel />
      </main>
    </div>
  );
}
