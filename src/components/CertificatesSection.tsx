"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, VisuallyHidden, DialogOverlay, DialogPortal } from '@/components/ui/dialog';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import * as DialogPrimitive from "@radix-ui/react-dialog";

const certificates = [
  { id: 1, src: '/certificates/ser1.jpg', alt: 'Сертификат качества ISO 9001' },
  { id: 2, src: '/certificates/ser2.jpg', alt: 'Сертификат соответствия ГОСТ' },
  { id: 3, src: '/certificates/ser3.jpg', alt: 'Сертификат пожарной безопасности' },
];

export function CertificatesSection() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Настройки карусели для разных экранов
  const itemsPerSlide = {
    mobile: 1,
    tablet: 2, 
    desktop: 4
  };

  const totalSlides = {
    mobile: certificates.length,
    tablet: Math.ceil(certificates.length / itemsPerSlide.tablet),
    desktop: Math.ceil(certificates.length / itemsPerSlide.desktop)
  };

  const nextCertificate = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % certificates.length);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides.desktop);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides.desktop) % totalSlides.desktop);
  };

  const prevCertificate = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? certificates.length - 1 : selectedIndex - 1);
    }
  };

  const currentCertificate = selectedIndex !== null ? certificates[selectedIndex] : null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
            Сертификация
          </h2>
          <p className="text-lg text-[#989898] max-w-2xl mx-auto">
            Наша продукция имеет все необходимые сертификаты качества и соответствует международным стандартам
          </p>
        </div>

        {/* Универсальная карусель */}
        <div className="relative">
          {/* Мобильная версия - горизонтальный скролл */}
          <div className="md:hidden">
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-4 pb-4" style={{ width: `${certificates.length * 280}px` }}>
                {certificates.map((certificate, index) => (
                  <div key={certificate.id} 
                       className="group cursor-pointer bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 shrink-0"
                       style={{ width: '260px' }}
                       onClick={() => setSelectedIndex(index)}>
                    <div className="aspect-3/4 relative overflow-hidden">
                      <Image
                        src={certificate.src}
                        alt={certificate.alt}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Десктопная версия - карусель с кнопками */}
          <div className="hidden md:block">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-300 gap-3"
                style={{ 
                  transform: `translateX(-${currentSlide * 100}%)`,
                  width: `${totalSlides.desktop * 100}%`
                }}
              >
                {Array.from({ length: totalSlides.desktop }).map((_, slideIndex) => (
                  <div key={slideIndex} className="grid md:grid-cols-3 gap-2 w-[90vw] shrink-0">
                    {certificates
                      .slice(
                        slideIndex * itemsPerSlide.desktop, 
                        (slideIndex + 1) * itemsPerSlide.desktop
                      )
                      .map((certificate, index) => (
                        <div key={certificate.id} 
                             className="group cursor-pointer bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
                             onClick={() => setSelectedIndex(slideIndex * itemsPerSlide.desktop + index)}>
                          <div className="aspect-3/4 relative overflow-hidden">
                            <Image
                              src={certificate.src}
                              alt={certificate.alt}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                          </div>
                        </div>
                      ))
                    }
                  </div>
                ))}
              </div>
            </div>

            {/* Навигационные кнопки для десктопа */}
            {totalSlides.desktop > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg text-gray-600 hover:text-gray-900 transition-all duration-200"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg text-gray-600 hover:text-gray-900 transition-all duration-200"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>

          {/* Индикаторы слайдов */}
          <div className="flex justify-center mt-6">
            <div className="flex gap-2">
              {/* Мобильные индикаторы */}
              <div className="md:hidden flex gap-2">
                {certificates.map((_, index) => (
                  <div key={index} className="w-2 h-2 rounded-full bg-gray-300"></div>
                ))}
              </div>
              
              {/* Десктопные индикаторы */}
              {totalSlides.desktop > 1 && (
                <div className="hidden md:flex gap-2">
                  {Array.from({ length: totalSlides.desktop }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                        currentSlide === index ? 'bg-blue-500' : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Модальное окно */}
        <Dialog open={selectedIndex !== null} onOpenChange={(open) => {
          if (!open) {
            setSelectedIndex(null);
          }
        }}>
          <DialogPortal>
            {/* Белый фон на весь экран */}
            <div className="fixed inset-0 z-50 bg-white" />
            <DialogPrimitive.Content className="fixed inset-0 z-50 w-screen h-screen overflow-hidden">
              <VisuallyHidden>
                <DialogTitle>{currentCertificate?.alt}</DialogTitle>
              </VisuallyHidden>
              
              <div className="relative w-full h-full flex items-center justify-center bg-white">
                {/* Кнопка закрытия */}
                <DialogPrimitive.Close className="absolute top-4 right-4 z-10 p-2 bg-[#333333]/80 hover:bg-[#333333] rounded-full text-white transition-colors">
                  <X className="h-6 w-6" />
                </DialogPrimitive.Close>

                {/* Навигация */}
                {certificates.length > 1 && (
                  <>
                    <button
                      onClick={prevCertificate}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-[#333333]/80 hover:bg-[#333333] rounded-full text-white transition-colors"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={nextCertificate}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-[#333333]/80 hover:bg-[#333333] rounded-full text-white transition-colors"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}
                
                {/* Индикатор */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-[#333333]/80 rounded-full px-3 py-1 text-white text-sm">
                  {(selectedIndex || 0) + 1} / {certificates.length}
                </div>

                {/* Изображение */}
                {currentCertificate && (
                  <div className="w-full h-full flex items-center justify-center p-4">
                    <div className="relative">
                      <Image
                        src={currentCertificate.src}
                        alt={currentCertificate.alt}
                        width={800}
                        height={1000}
                        className="object-contain max-h-[90vh] w-auto h-auto"
                        quality={100}
                      />
                    </div>
                  </div>
                )}
              </div>
            </DialogPrimitive.Content>
          </DialogPortal>
        </Dialog>

        <div className="mt-12 text-center">
          <p className="text-[#989898]">
            Все сертификаты подтверждают высокое качество наших стеновых панелей и их соответствие требованиям безопасности
          </p>
        </div>
      </div>
    </section>
  );
}