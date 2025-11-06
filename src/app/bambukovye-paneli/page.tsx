import Header from "@/components/Header";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function BambooPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header variant="solid" />
      <main className="pt-6">
        <div className="container mx-auto px-4 py-8">
          {/* Хлебные крошки */}
          <nav className="text-sm text-gray-500 mb-8">
            <a href="/" className="hover:text-gray-700">Главная</a>
            <span className="mx-2">/</span>
            <a href="/catalog" className="hover:text-gray-700">Каталог</a>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Бамбуковые панели</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Изображение */}
            <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
              <Image
                src="/images/wall.png"
                alt="Бамбуковые панели"
                fill
                className="object-cover"
              />
            </div>

            {/* Контент */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-6">
                Бамбуковые панели
              </h1>
              
              <div className="prose prose-lg text-gray-700 mb-8">
                <p>
                  Экологически чистые бамбуковые панели — это идеальное решение для создания 
                  уютной и современной атмосферы в любом интерьере. Натуральный бамбук обладает 
                  уникальными свойствами прочности и долговечности.
                </p>
                
                <h3 className="text-xl font-bold text-gray-900 mt-6 mb-4">Преимущества:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>100% экологически чистый материал</li>
                  <li>Высокая прочность и устойчивость к влаге</li>
                  <li>Естественная антибактериальная защита</li>
                  <li>Простота в установке и уходе</li>
                  <li>Уникальная текстура и натуральный цвет</li>
                </ul>
                
                <h3 className="text-xl font-bold text-gray-900 mt-6 mb-4">Применение:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Жилые помещения (гостиные, спальни)</li>
                  <li>Офисы и коммерческие пространства</li>
                  <li>Рестораны и кафе</li>
                  <li>Спа-центры и wellness зоны</li>
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