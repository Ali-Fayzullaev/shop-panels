
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Panel3DPage() {
  return (
    <div className="min-h-screen bg-white">

      <main className="pt-6">
        <div className="container mx-auto px-4 py-8">
          <nav className="text-sm text-gray-500 mb-8">
            <a href="/" className="hover:text-gray-700">Главная</a>
            <span className="mx-2">/</span>
            <a href="/catalog" className="hover:text-gray-700">Каталог</a>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Панели с 3D печатью</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
              <Image
                src="/images/wall2.png"
                alt="Панели с 3D печатью"
                fill
                className="object-cover"
              />
            </div>

            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-6">
                Панели с 3D печатью
              </h1>
              
              <div className="prose prose-lg text-gray-700 mb-8">
                <p>
                  Инновационные панели с объемными узорами и уникальными дизайнерскими решениями. 
                  Технология 3D печати позволяет создавать невероятные текстуры и формы.
                </p>
                
                <h3 className="text-xl font-bold text-gray-900 mt-6 mb-4">Преимущества:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Уникальные объемные узоры</li>
                  <li>Безграничные дизайнерские возможности</li>
                  <li>Высокая детализация печати</li>
                  <li>Индивидуальное производство</li>
                  <li>Современные материалы</li>
                </ul>
                
                <h3 className="text-xl font-bold text-gray-900 mt-6 mb-4">Применение:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Дизайнерские интерьеры</li>
                  <li>Выставочные залы и галереи</li>
                  <li>Премиум офисы</li>
                  <li>Эксклюзивные жилые проекты</li>
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
