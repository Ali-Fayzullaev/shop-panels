"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, VisuallyHidden, DialogOverlay, DialogPortal } from '@/components/ui/dialog';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import * as DialogPrimitive from "@radix-ui/react-dialog";

const certificates = [
  { id: 1, src: '/ser/ser01.jpg', alt: 'Сертификат' },
  { id: 2, src: '/ser/ser02.jpg', alt: 'Сертификат' },
  { id: 3, src: '/ser/ser03.jpg', alt: 'Сертификат' },
  { id: 4, src: '/ser/ser04.jpg', alt: 'Сертификат' },
];

export function CertificatesSection() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const nextCertificate = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % certificates.length);
    }
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {certificates.map((certificate, index) => (
            <div key={certificate.id} 
                 className="group cursor-pointer bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
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
                    <div className="relative max-w-4xl max-h-full">
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