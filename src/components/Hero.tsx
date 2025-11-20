"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative h-[80vh] min-h-[600px]">
      {/* Hero Background with Single Image */}
      <div className="absolute inset-0 z-0">
        <div className="relative h-full w-full overflow-hidden bg-gray-900">
          <Image
            src="/images/wall1.jpg"
            alt="Декоративные стеновые панели"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30" />
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex items-center justify-start px-6 lg:px-8 h-full">
        {/* Left side dark overlay for text readability */}
        <div className="absolute left-0 top-0 w-1/2 h-full bg-black/40"></div>

        <div className="relative z-10 text-left max-w-xl ml-8 lg:ml-16">
          {/* Small text above title */}
          <p className="text-xs md:text-sm text-white/80 mb-3 font-medium tracking-wide">
            Доставляем по всей Казахстану
          </p>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6 leading-tight">
            Декоративные стеновые панели для внутренней и внешней отделки стен
          </h1>

          <p className="text-sm md:text-base text-white/90 mb-6 max-w-lg leading-relaxed">
            Преобразите ваше пространство с помощью наших премиальных стеновых
            панелей. Качество, стиль и долговечность в каждом решении.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              size="default"
              className="bg-white text-black hover:bg-white/90 text-sm px-6 py-3 h-auto"
            >
              Посмотреть каталог
            </Button>
            <Button
              variant="outline"
              size="default"
              className="bg-transparent border-white text-white hover:bg-white hover:text-black text-sm px-6 py-3 h-auto"
            >
              Бесплатная консультация
            </Button>
          </div>
          
          {/* Дополнительная кнопка для книги */}
          <div className="mt-6 pt-6 border-t border-white/20">
            <div className="flex flex-col sm:flex-row gap-3">
              <a 
                href="/book/ultra"
                className="inline-flex items-center gap-2 bg-linear-to-r from-red-600 to-pink-600 text-white hover:from-red-700 hover:to-pink-700 text-sm px-6 py-3 h-auto rounded-md font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg animate-pulse"
              >
                🔥 ULTRA SAFE (100% Гарантия)
              </a>
              <a 
                href="/book/safe"
                className="inline-flex items-center gap-2 bg-linear-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 text-sm px-6 py-3 h-auto rounded-md font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg"
              >
                🛡️ Безопасная книга
              </a>
              <a 
                href="/book/simple"
                className="inline-flex items-center gap-2 bg-linear-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 text-sm px-6 py-3 h-auto rounded-md font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg"
              >
                📚 Простая книга
              </a>
            </div>
            <p className="text-xs text-white/60 mt-2">
              🔥 Ultra Safe - абсолютная защита от конфликтов DOM, 0% ошибок
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
