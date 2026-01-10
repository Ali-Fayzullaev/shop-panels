"use client";

import React, { useState } from "react";
import { MapPin, Phone, Clock, Building, ExternalLink } from "lucide-react";
import { COMPANY_INFO, formatPhoneForCall } from "@/lib/company-info";

const locations = [
  {
    id: 1,
    title: "Главный офис",
    address: "Улица Анет баба, 9, Астана",
    phone: COMPANY_INFO.phone,
    hours: COMPANY_INFO.workingHours,
    coordinates: { lat: 51.1694, lng: 71.4491 },
  },
];

// Координаты для Яндекс.Карт (формат: долгота,широта)
const YANDEX_MAP_CENTER = "71.4491,51.1694";
const YANDEX_MAP_MARKER = "71.4491,51.1694";

export function ContactSection() {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  // URL для открытия в Яндекс.Картах
  const yandexMapsUrl = `https://yandex.com/maps/?text=${encodeURIComponent("Улица Анет баба, 9, Астана")}&z=16`;

  // iframe URL для встроенной карты Яндекс
  const yandexIframeUrl = `https://yandex.ru/map-widget/v1/?ll=${YANDEX_MAP_CENTER}&z=16&pt=${YANDEX_MAP_MARKER},pm2rdm&l=map`;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
            Как нас найти
          </h2>
          <p className="text-lg text-[#989898] max-w-2xl mx-auto">
            Приходите к нам в офис или шоурум, чтобы посмотреть образцы панелей
            вживую и получить консультацию
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Карточки с адресами */}
          <div className="space-y-6">
            {locations.map((location) => (
              <div
                key={location.id}
                className="bg-white p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
              >
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

                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-[#333333] shrink-0" />
                    <span className="text-[#989898]">{location.hours}</span>
                  </div>
                </div>

                {/* Кнопка для открытия в картах */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <a
                    href={yandexMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#333333] hover:text-[#555555] font-medium transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Построить маршрут
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Контактная информация */}
          <div className="bg-[#333333] p-8 text-white flex flex-col justify-center">
            <h3 className="text-2xl font-bold mb-6">Свяжитесь с нами</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Наши опытные консультанты готовы помочь вам выбрать идеальные панели. 
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

          {/* Яндекс Карты (iframe) */}
          <div className="bg-white overflow-hidden shadow-md">
            <div className="h-full min-h-[400px] lg:min-h-[500px] relative">
              {!mapError ? (
                <>
                  {/* Лоадер пока карта загружается */}
                  {!mapLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#333333] mx-auto mb-4"></div>
                        <p className="text-[#989898]">Загрузка карты...</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Яндекс.Карты iframe */}
                  <iframe
                    src={yandexIframeUrl}
                    width="100%"
                    height="100%"
                    style={{ 
                      border: 0, 
                      minHeight: '500px',
                      opacity: mapLoaded ? 1 : 0,
                      transition: 'opacity 0.3s ease'
                    }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    onLoad={() => setMapLoaded(true)}
                    onError={() => setMapError(true)}
                    title="Карта офиса Marmarill в Астане"
                  />
                </>
              ) : (
                // Fallback если iframe не загрузился
                <div className="h-full flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200 min-h-[500px]">
                  <div className="text-center p-8">
                    <div className="w-24 h-24 bg-[#333333] flex items-center justify-center mx-auto mb-4">
                      <Building className="h-12 w-12 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-[#333333] mb-2">
                      Наш офис в Астане
                    </h3>
                    <p className="text-[#989898] mb-4">
                      Улица Анет баба, 9, Астана
                    </p>
                    <a
                      href={yandexMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#333333] text-white hover:bg-[#333333]/80 transition-colors"
                    >
                      <MapPin className="h-4 w-4" />
                      Открыть в Яндекс.Картах
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Призыв к действию */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-[#333333] mb-4">
            Приезжайте к нам в офис
          </h3>
          <p className="text-lg text-[#989898] mb-8 max-w-2xl mx-auto">
            Приезжайте к нам, чтобы увидеть качество панелей своими глазами
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={formatPhoneForCall(COMPANY_INFO.phoneClean)}
              className="inline-flex items-center justify-center px-6 py-3 bg-[#333333] hover:bg-[#333333]/80 text-white font-semibold transition-colors"
            >
              <Phone className="h-5 w-5 mr-2" />
              Позвонить
            </a>
            <a
              href={yandexMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-white hover:bg-gray-50 text-[#333333] font-semibold border-2 border-[#333333] transition-colors"
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
