"use client";

import React from 'react';
import { MapPin, Phone, Clock } from 'lucide-react';
import { COMPANY_INFO, formatPhoneForCall } from "@/lib/company-info";

const locations = [
  {
    id: 1,
    title: "Главный офис",
    address: COMPANY_INFO.address,
    phone: COMPANY_INFO.phone,
    hours: COMPANY_INFO.workingHours
  }
];

export function ContactSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
            Как нас найти
          </h2>
          <p className="text-lg text-[#989898] max-w-2xl mx-auto">
            Приходите к нам в офис или шоурум, чтобы посмотреть образцы панелей вживую и получить консультацию
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Карточки с адресами */}
          <div className="space-y-6">
            {locations.map((location) => (
              <div key={location.id} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-bold text-[#333333] mb-4">
                  {location.title}
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-[#333333] mt-1 shrink-0" />
                    <span className="text-[#989898]">{location.address}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-[#333333] shrink-0" />
                    <a 
                      href={`tel:${location.phone}`} 
                      className="text-[#989898] hover:text-[#333333] transition-colors"
                    >
                      {location.phone}
                    </a>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-[#333333] mt-1 shrink-0" />
                    <span className="text-[#989898]">{location.hours}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Дополнительная информация */}
            <div className="bg-[#333333] rounded-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-4">
                Связаться с нами
              </h3>
              <p className="text-gray-300 mb-4">
                Остались вопросы? Звоните нам или приезжайте в наши офисы. 
                Наши специалисты помогут выбрать идеальные панели для вашего проекта.
              </p>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0" />
                <a 
                  href={formatPhoneForCall(COMPANY_INFO.phoneClean)} 
                  className="text-lg font-semibold hover:text-gray-300 transition-colors"
                >
                  {COMPANY_INFO.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Карта */}
          <div className="bg-white rounded-lg overflow-hidden shadow-md">
            <div className="h-full min-h-[400px] lg:min-h-[500px]">
              <iframe
                src="https://yandex.ru/map-widget/v1/?um=constructor%3A8f4c5d89f0a6b3c7e2d9a1f4c8e6b2d5a9c3f7e1b4d8c2f6a9e3d7b1c5f9a2e6&amp;source=constructor"
                width="100%"
                height="100%"
                frameBorder="0"
                className="border-0"
                title="Наше расположение"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Призыв к действию */}
        <div className="text-center">
          <p className="text-lg text-[#989898] mb-6">
            Приезжайте к нам, чтобы увидеть качество панелей своими глазами
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={formatPhoneForCall(COMPANY_INFO.phoneClean)}
              className="inline-flex items-center justify-center px-6 py-3 bg-[#333333] hover:bg-[#333333]/80 text-white font-semibold  transition-colors"
            >
              <Phone className="h-5 w-5 mr-2" />
              Позвонить
            </a>
            <a
              href="https://yandex.ru/maps/213/moscow/?text=Рязанский%20проспект%202%20корп%203"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-white hover:bg-gray-50 text-[#333333] font-semibold  border-2 border-[#333333] transition-colors"
            >
              <MapPin className="h-5 w-5 mr-2" />
              Открыть в картах
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}