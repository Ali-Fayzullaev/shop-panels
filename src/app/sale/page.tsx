
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const saleItems = [
  {
    title: "Бамбуковые панели",
    originalPrice: "15,000 ₸",
    salePrice: "7,500 ₸",
    discount: "50%",
    image: "/images/wall.png",
    description: "Экологически чистые панели из натурального бамбука"
  },
  {
    title: "Рифленые панели",
    originalPrice: "12,000 ₸",
    salePrice: "8,400 ₸",
    discount: "30%",
    image: "/images/wall1.jpg",
    description: "Стильные рифленые панели с современным дизайном"
  },
  {
    title: "Гибкая керамика",
    originalPrice: "25,000 ₸",
    salePrice: "17,500 ₸",
    discount: "30%",
    image: "/images/wall4.png",
    description: "Революционная гибкая керамика для криволинейных поверхностей"
  }
]

export default function SalePage() {
  return (
    <div className="min-h-screen bg-white">

      <main className="pt-6">
        {/* Hero секция с акциями */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="flex justify-center items-center gap-4 mb-4">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.898-.088L9.75 13.9 6.5 15a1 1 0 01-.416-1.962L9.25 12.1 8.069 8.456a1 1 0 011.898-.088L11.146 7.2 14.5 5.266a1 1 0 010-1.732L11.146 1.8 12.067 2.744A1 1 0 0112 2z" clipRule="evenodd" />
              </svg>
              <h1 className="text-5xl font-bold">АКЦИИ И СКИДКИ</h1>
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.898-.088L9.75 13.9 6.5 15a1 1 0 01-.416-1.962L9.25 12.1 8.069 8.456a1 1 0 011.898-.088L11.146 7.2 14.5 5.266a1 1 0 010-1.732L11.146 1.8 12.067 2.744A1 1 0 0112 2z" clipRule="evenodd" />
              </svg>
            </div>
            
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Невероятные скидки до 50% на популярные стеновые панели! 
              Ограниченное время действия - не упустите возможность!
            </p>
            
            <div className="flex justify-center gap-4">
              <Badge className="bg-yellow-400 text-red-600 hover:bg-yellow-500 text-lg px-4 py-2 font-bold">
                🔥 ГОРЯЧИЕ ПРЕДЛОЖЕНИЯ
              </Badge>
              <Badge className="bg-white text-red-600 hover:bg-gray-100 text-lg px-4 py-2 font-bold">
                ⏰ ОГРАНИЧЕННОЕ ВРЕМЯ
              </Badge>
            </div>
          </div>
        </div>

        {/* Товары со скидками */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {saleItems.map((item, index) => (
              <div key={index} className="bg-white border-2 border-red-200 overflow-hidden hover:shadow-xl transition-shadow duration-300 relative">
                {/* Большой бейдж скидки */}
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-red-500 text-white px-3 py-2 font-bold text-lg transform rotate-12">
                    -{item.discount}
                  </div>
                </div>
                
                <div className="relative aspect-4/3 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl font-bold text-red-600">
                      {item.salePrice}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      {item.originalPrice}
                    </span>
                  </div>
                  
                  <Button className="w-full bg-red-600 hover:bg-red-700">
                    Заказать со скидкой
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Призыв к действию */}
          <div className="text-center mt-16 bg-gray-50 p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Не упустите возможность!
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Акция действует ограниченное время. Свяжитесь с нами прямо сейчас 
              для оформления заказа со скидкой.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 px-8">
                📞 Позвонить сейчас
              </Button>
              <Button variant="outline" size="lg" className="border-red-600 text-red-600 hover:bg-red-50 px-8">
                💬 Написать в WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
