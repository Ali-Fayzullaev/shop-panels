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
        </div>
      </div>
    </section>
  );
};

export default Hero;
