"use client";

import React, { useState, useEffect } from 'react';
import { ChevronUp, Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#333333] text-white relative">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* О компании */}
          <div>
            <h3 className="text-xl font-bold mb-4">Стеновые панели</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Качественные стеновые панели для современного интерьера. 
              Доставка по всей России и профессиональный монтаж.
            </p>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5" />
              <a 
                href="tel:+79937021764" 
                className="text-gray-300 hover:text-white transition-colors"
              >
                +7 (993) 702-17-64
              </a>
            </div>
          </div>

          {/* Каталог */}
          <div>
            <h3 className="text-xl font-bold mb-4">Каталог</h3>
            <ul className="space-y-2">
              <li><a href="/catalog/bambukovye-paneli" className="text-gray-300 hover:text-white transition-colors">Бамбуковые панели</a></li>
              <li><a href="/catalog/riflenye-paneli" className="text-gray-300 hover:text-white transition-colors">Рифленые панели</a></li>
              <li><a href="/catalog/derevyannye-paneli" className="text-gray-300 hover:text-white transition-colors">Деревянные панели</a></li>
              <li><a href="/catalog/3d-paneli" className="text-gray-300 hover:text-white transition-colors">3D панели</a></li>
              <li><a href="/catalog/mdf-paneli" className="text-gray-300 hover:text-white transition-colors">MDF панели</a></li>
              <li><a href="/catalog/gipsovye-paneli" className="text-gray-300 hover:text-white transition-colors">Гипсовые панели</a></li>
              <li><a href="/catalog/sale" className="text-gray-300 hover:text-white transition-colors">Распродажа</a></li>
            </ul>
          </div>

          {/* Услуги */}
          <div>
            <h3 className="text-xl font-bold mb-4">Услуги</h3>
            <ul className="space-y-2">
              <li><span className="text-gray-300">Бесплатная консультация</span></li>
              <li><span className="text-gray-300">Расчёт стоимости</span></li>
              <li><span className="text-gray-300">Доставка по России</span></li>
              <li><span className="text-gray-300">Профессиональный монтаж</span></li>
              <li><a href="/dealers" className="text-gray-300 hover:text-white transition-colors">Наши дилеры</a></li>
              <li><span className="text-gray-300">Гарантия качества</span></li>
              <li><span className="text-gray-300">Техническая поддержка</span></li>
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              <a href="/contacts" className="hover:text-gray-300 transition-colors">Контакты</a>
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-1 shrink-0" />
                <div className="text-gray-300">
                  <p>Главный офис:</p>
                  <p>ТЦ Декоратор, Рязанский проспект 2, корп. 3, этаж 2</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-1 shrink-0" />
                <div className="text-gray-300">
                  <p>Шоурум:</p>
                  <p>ТЦ Галерея ремонта, МКАД 47 км</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0" />
                <a 
                  href="tel:+79937021764" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  +7 (993) 702-17-64
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Разделитель */}
        <div className="border-t border-gray-600 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              © 2025 Стеновые панели. Все права защищены.
            </div>
            <div className="flex gap-6 text-sm">
              <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Политика конфиденциальности
              </a>
              <a href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Условия использования
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Кнопка "Наверх" */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 bg-white hover:bg-gray-100 text-[#333333] rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Прокрутить наверх"
        >
          <ChevronUp className="h-6 w-6" />
        </button>
      )}
    </footer>
  );
}