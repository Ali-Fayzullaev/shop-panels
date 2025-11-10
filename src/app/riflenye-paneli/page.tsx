
import PageHero from "@/components/PageHero";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function RifledPage() {
  const breadcrumbs = [
    { label: "Главная", href: "/" },
    { label: "Каталог", href: "/catalog" },
    { label: "Рифленые панели" }
  ];

  return (
    <div className="min-h-screen bg-white">

      <PageHero 
        title="Рифленые панели"
        description="Стильные рифленые панели с фактурной поверхностью для создания оригинального интерьера"
        backgroundImage="/images/wall2.png"
        breadcrumbs={breadcrumbs}
      />
      <main className="pt-6">
        <div className="container mx-auto px-4 py-8">

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
              <Image
                src="/images/wall1.jpg"
                alt="Рифленые панели"
                fill
                className="object-cover"
              />
            </div>

            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-6">
                Рифленые панели
              </h1>
              
              <div className="prose prose-lg text-gray-700 mb-8">
                <p>
                  Стильные рифленые панели с выразительной текстурированной поверхностью 
                  создают современный архитектурный облик и добавляют глубину интерьеру.
                </p>
                
                <h3 className="text-xl font-bold text-gray-900 mt-6 mb-4">Преимущества:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Современный минималистичный дизайн</li>
                  <li>Игра света и тени на поверхности</li>
                  <li>Высокая износостойкость</li>
                  <li>Легкость монтажа</li>
                  <li>Разнообразие размеров и цветов</li>
                </ul>
                
                <h3 className="text-xl font-bold text-gray-900 mt-6 mb-4">Применение:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Современные офисы и коворкинги</li>
                  <li>Торговые центры и бутики</li>
                  <li>Жилые интерьеры в стиле минимализм</li>
                  <li>Общественные пространства</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="px-8">
                  Заказать консультацию
                </Button>
                <Button variant="outline" size="lg" className="px-8">
                  Скачать каталог
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
