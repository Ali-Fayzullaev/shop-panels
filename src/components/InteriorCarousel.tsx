"use client"

import Image from "next/image"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const wallImages = [
  "wall.png",
  "wall1.jpg",
  "wall2.png",
  "wall3.png",
  "wall4.png",
  "wall5.jpg",
  "wall6.png",
  "wall7.png",
  "wall8.webp",
  "wall9.jpg",
  "wall10.png",
  "wall11.png",
]

export function InteriorCarousel() {
  return (
    <div className="w-full py-8">
      <div className="container mx-auto px-4">
        {/* Заголовок и текст над каруселью */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 uppercase tracking-wide mb-4">
            ГИБКОЕ ИНТЕРЬЕРНОЕ РЕШЕНИЕ
          </h2>
          <div className="text-base text-gray-700 space-y-2">
            <p>— Для жилых помещений (квартиры, дома)</p>
            <p>— Для коммерческих помещений (офисы, рестораны, отели, ресепшен, салоны красоты, рестораны, бары и др.)</p>
            <p>— Для муниципальных учреждений</p>
          </div>
        </div>

        {/* Карусель */}
        <div className="relative">
          <Carousel className="w-full" opts={{ loop: true }}>
            {/* Кнопки навигации наверху (скрыты на мобильных) */}
            <div className="hidden md:flex justify-end gap-4 mb-6">
              <CarouselPrevious className="relative top-0 left-0 translate-x-0 translate-y-0 rounded-none h-10 w-10" />
              <CarouselNext className="relative top-0 right-0 translate-x-0 translate-y-0 rounded-none h-10 w-10" />
            </div>

            <CarouselContent className="-ml-2 md:-ml-4">
              {wallImages.map((image, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                  <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
                    <Image
                      src={`/images/${image}`}
                      alt={`Интерьерное решение ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </div>
  )
}