"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice, type Product, type Category } from "@/data/types";

interface ProductPageProps {
  product: Product;
  category: Category;
}

export function ProductPageContent({ product, category }: ProductPageProps) {
  const [activeTab, setActiveTab] = useState("about");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedThickness, setSelectedThickness] = useState(0);

  // Получаем все изображения товара
  const allImages = product.images || [product.image];

  const breadcrumbs = [
    { label: "Главная", href: "/" },
    { label: "Каталог", href: "/catalog" },
    { label: category.name, href: `/${category.id}` },
    { label: product.name }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Хлебные крошки */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center">
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-blue-600 transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-gray-900 font-medium">{crumb.label}</span>
                )}
                {index < breadcrumbs.length - 1 && (
                  <span className="mx-2 text-gray-400">/</span>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Галерея изображений с каруселью */}
          <div className="space-y-4">
            {/* Основное изображение */}
            <div className="relative aspect-square overflow-hidden bg-gray-100 border">
              <Image
                src={allImages[selectedImageIndex]}
                alt={`${product.name} - изображение ${selectedImageIndex + 1}`}
                fill
                className="object-cover transition-all duration-300"
              />
              
              {product.saleInfo?.isOnSale && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-red-500 text-white hover:bg-red-600">
                    {product.saleInfo.badge}
                  </Badge>
                </div>
              )}

              {/* Стрелки для переключения */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImageIndex(selectedImageIndex === 0 ? allImages.length - 1 : selectedImageIndex - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2  transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setSelectedImageIndex(selectedImageIndex === allImages.length - 1 ? 0 : selectedImageIndex + 1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2  transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Индикатор количества изображений */}
              {allImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1  text-sm">
                  {selectedImageIndex + 1} / {allImages.length}
                </div>
              )}
            </div>
          </div>

          {/* Информация о товаре */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                <span>SKU: <span className="font-medium text-gray-700">{product.sku}</span></span>
              </div>
            </div>

            {/* Цена */}
            <div className="space-y-2 pb-6 border-b">
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold text-gray-900">
                  {formatPrice(product.price, product.currency)}
                </span>
                <span className="text-xl text-gray-500">/ {product.unit}</span>
              </div>
              
              {product.originalPrice && (
                <div className="flex items-center gap-2">
                  <span className="text-xl text-gray-400 line-through">
                    {formatPrice(product.originalPrice, product.currency)}
                  </span>
                  <span className="text-sm text-red-600 font-medium">
                    Скидка {product.discount}%
                  </span>
                </div>
              )}
            </div>

            {/* Характеристики */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Размер</span>
                  <div className="text-lg font-semibold text-gray-900">{product.specifications.size}</div>
                </div>
              </div>
            </div>

            {/* Доступные толщины */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Толщина</h3>
              <div className="flex flex-wrap gap-2">
                {product.specifications?.thickness?.map((thickness, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedThickness(index)}
                    className={`relative p-4 text-center border-2 transition-all duration-200 ${
                      selectedThickness === index
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                    }`}
                  >
                    <div className="text-xl font-bold text-gray-900 mb-1">{thickness}</div>
                    
                    {/* Индикатор выбора */}
                    <div className={`absolute top-1 right-1 w-2 h-2  border-2 transition-all rounded-full ${
                      selectedThickness === index
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}>
                      <div className={`w-full h-full  bg-white transition-transform rounded-full ${
                        selectedThickness === index ? "scale-50" : ""
                      }`}></div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
             {/* Миниатюры изображений */}
            {allImages.length > 1 && (
              <div className="grid grid-cols-6 gap-2">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-square overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index 
                        ? "border-black ring-2 ring-black/20" 
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} миниатюра ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Кнопка добавить в корзину */}
            <div className="pt-6">
              <Button size="lg" className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-4 text-lg">
                Добавить в корзину
              </Button>
            </div>
          </div>
        </div>

        {/* Табы с информацией */}
        <div className="mt-16 pt-8 border-t">
          <div className="mb-8">
            <div className="flex border-b border-gray-200">
              <button 
                onClick={() => setActiveTab("about")}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === "about" 
                    ? "text-black border-b-2 border-black" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                О товаре
              </button>
              <button 
                onClick={() => setActiveTab("delivery")}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === "delivery" 
                    ? "text-black border-b-2 border-black" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Доставка и оплата
              </button>
              <button 
                onClick={() => setActiveTab("installation")}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === "installation" 
                    ? "text-black border-b-2 border-black" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Монтаж
              </button>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            {activeTab === "about" && (
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Описание товара</h3>
                  <p className="text-gray-600 mb-6">{product.description}</p>
                  
                  <h4 className="font-semibold mb-3">Технические характеристики:</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li><strong>Материал:</strong> {product.specifications.material}</li>
                    <li><strong>Покрытие:</strong> {product.specifications.finish}</li>
                    <li><strong>Размер:</strong> {product.specifications.size}</li>
                    <li><strong>Доступные толщины:</strong> {product.specifications?.thickness?.join(", ") || "Не указано"}</li>
                    {product.specifications.length && (
                      <li><strong>Длина:</strong> {product.specifications.length}</li>
                    )}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Преимущества:</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Высокое качество материалов</li>
                    <li>• Простота монтажа</li>
                    <li>• Долговечность и надежность</li>
                    <li>• Современный дизайн</li>
                    <li>• Экологическая безопасность</li>
                  </ul>
                  
                  <div className="mt-6 p-4 bg-gray-50 ">
                    <h5 className="font-semibold mb-2">Гарантия качества</h5>
                    <p className="text-sm text-gray-600">
                      На все наши изделия предоставляется официальная гарантия. 
                      Профессиональный монтаж и консультации специалистов.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "delivery" && (
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Доставка</h3>
                  <div className="space-y-4 text-gray-600">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">По Алматы</h4>
                      <ul className="space-y-1">
                        <li>• Бесплатная доставка при заказе от 50 000 ₸</li>
                        <li>• Стоимость доставки: от 3 000 ₸</li>
                        <li>• Время доставки: 1-2 дня</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">По Казахстану</h4>
                      <ul className="space-y-1">
                        <li>• Транспортными компаниями</li>
                        <li>• Срок доставки: 3-7 дней</li>
                        <li>• Стоимость рассчитывается индивидуально</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4">Оплата</h3>
                  <div className="space-y-4 text-gray-600">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Способы оплаты</h4>
                      <ul className="space-y-1">
                        <li>• Наличными при получении</li>
                        <li>• Банковской картой</li>
                        <li>• Безналичный расчет для юр. лиц</li>
                        <li>• Kaspi QR, Kaspi Gold</li>
                      </ul>
                    </div>
                    
                    <div className="mt-6 p-4 bg-blue-50">
                      <h5 className="font-semibold mb-2">Гарантия возврата</h5>
                      <p className="text-sm text-gray-600">
                        Возврат товара в течение 14 дней при сохранении товарного вида и упаковки.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "installation" && (
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Профессиональный монтаж</h3>
                  <div className="space-y-4 text-gray-600">
                    <p>
                      Наши специалисты выполнят качественный монтаж декоративных панелей 
                      с соблюдением всех технологических требований.
                    </p>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Услуги монтажа</h4>
                      <ul className="space-y-1">
                        <li>• Подготовка поверхности</li>
                        <li>• Разметка и крепление каркаса</li>
                        <li>• Установка декоративных панелей</li>
                        <li>• Монтаж комплектующих и профилей</li>
                        <li>• Финишная обработка стыков</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Стоимость работ</h4>
                      <ul className="space-y-1">
                        <li>• От 2 500 ₸ за м²</li>
                        <li>• Выезд замерщика: бесплатно</li>
                        <li>• Гарантия на работы: 2 года</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4">Самостоятельный монтаж</h3>
                  <div className="space-y-4 text-gray-600">
                    <p>
                      Наши панели легко монтируются самостоятельно при наличии 
                      базовых навыков работы с инструментом.
                    </p>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Необходимые инструменты</h4>
                      <ul className="space-y-1">
                        <li>• Дрель или перфоратор</li>
                        <li>• Уровень строительный</li>
                        <li>• Рулетка и карандаш</li>
                        <li>• Саморезы и дюбели</li>
                        <li>• Пила или лобзик для подрезки</li>
                      </ul>
                    </div>
                    
                    <div className="mt-6 p-4 bg-green-50 ">
                      <h5 className="font-semibold mb-2">Консультации бесплатно</h5>
                      <p className="text-sm text-gray-600">
                        Наши специалисты бесплатно проконсультируют по вопросам монтажа. 
                        Подробная инструкция прилагается к каждому заказу.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Похожие товары */}
        <div className="mt-16 pt-16 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Похожие товары</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {category.products && category.products
              .filter(p => p.id !== product.id)
              .slice(0, 3)
              .map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/${category.id}/${relatedProduct.id}`}
                  className="group block bg-white border overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative aspect-4/3 bg-gray-100">
                    <Image
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-lg font-bold text-gray-900">
                      {formatPrice(relatedProduct.price, relatedProduct.currency)}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
}