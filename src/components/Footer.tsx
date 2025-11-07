"use client";

import React, { useState, useEffect } from 'react';
import { ChevronUp, Phone, Mail, MapPin, Instagram, MessageCircle, Send } from 'lucide-react';
import { COMPANY_INFO, formatPhoneForCall, formatPhoneForWhatsApp } from "@/lib/company-info";

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
            <h3 className="text-xl font-bold mb-4">{COMPANY_INFO.name}</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              {COMPANY_INFO.description}. 
              Доставка по всему Казахстану и профессиональный монтаж.
            </p>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5" />
              <a 
                href={formatPhoneForCall(COMPANY_INFO.phoneClean)} 
                className="text-gray-300 hover:text-white transition-colors"
              >
                {COMPANY_INFO.phone}
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

          {/* Социальные сети */}
          <div>
            <h3 className="text-xl font-bold mb-4">Мы в соцсетях</h3>
            <div className="space-y-4">
              <a 
                href={COMPANY_INFO.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors group"
              >
                <Instagram className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span>Instagram</span>
              </a>
              
              <a 
                href={formatPhoneForWhatsApp(COMPANY_INFO.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors group"
              >
                <MessageCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span>WhatsApp</span>
              </a>
              
              <a 
                href={COMPANY_INFO.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors group"
              >
                <Send className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span>Telegram</span>
              </a>
            </div>
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
                  <p>Офис:</p>
                  <p>{COMPANY_INFO.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0" />
                <a 
                  href={formatPhoneForCall(COMPANY_INFO.phoneClean)} 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {COMPANY_INFO.phone}
                </a>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0" />
                <a 
                  href={`mailto:${COMPANY_INFO.email}`} 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {COMPANY_INFO.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Разделитель */}
        <div className="border-t border-gray-600 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              © 2025 {COMPANY_INFO.name}. Все права защищены.
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