"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Header = () => {
  // Массив изображений для слайдшоу
  const heroImages = [
    "/images/wall.png",
    "/images/wall1.jpg",
    // '/images/wall2.png',
    // '/images/wall3.png',
    // '/images/wall4.png',
    // '/images/wall5.jpg',
    // '/images/wall6.png'
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Автоматическое переключение изображений каждые 5 секунд
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // 5 секунд

    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <header className="relative min-h-screen">
      {/* Hero Background with Slideshow */}
      <div className="absolute inset-0 z-0">
        <div className="relative h-full w-full overflow-hidden">
          {heroImages.map((image, index) => (
            <div
              key={image}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={image}
                alt={`Декоративные стеновые панели ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
          {/* Overlay for better text readability - only for content area, not navigation */}
          <div className="absolute inset-0 bg-black/30" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between p-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-white">WallPanels</h1>
        </div>

        {/* Navigation Menu */}
        <NavigationMenu className="hidden lg:flex" delayDuration={200}>
          <NavigationMenuList>
            {/* Каталог с выпадающим меню */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-white hover:text-white hover:bg-white/10 bg-transparent">
                Каталог
              </NavigationMenuTrigger>
              <NavigationMenuContent className="z-50">
                <div className="grid w-[280px] gap-1 p-3 grid-cols-1 bg-white shadow-lg border rounded-md">
                  <NavigationMenuLink
                    className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 text-sm font-medium text-gray-900"
                    href="/catalog/bamboo"
                  >
                    Бамбуковые панели
                  </NavigationMenuLink>
                  <NavigationMenuLink
                    className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 text-sm font-medium text-gray-900"
                    href="/catalog/rifled"
                  >
                    Рифленые панели
                  </NavigationMenuLink>
                  <NavigationMenuLink
                    className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 text-sm font-medium text-gray-900"
                    href="/catalog/digital-print"
                  >
                    Панели с цифровой печатью
                  </NavigationMenuLink>
                  <NavigationMenuLink
                    className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 text-sm font-medium text-gray-900"
                    href="/catalog/aluminum"
                  >
                    Вспененный алюминий
                  </NavigationMenuLink>
                  <NavigationMenuLink
                    className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 text-sm font-medium text-gray-900"
                    href="/catalog/ceramic"
                  >
                    Гибкая керамика
                  </NavigationMenuLink>
                  <NavigationMenuLink
                    className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 text-sm font-medium text-gray-900"
                    href="/catalog/profiles"
                  >
                    Монтажные профили
                  </NavigationMenuLink>
                  <NavigationMenuLink
                    className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 text-sm font-medium text-gray-900"
                    href="/promotions"
                  >
                    Акции
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Покупателям с выпадающим меню */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-white hover:text-white hover:bg-white/10 bg-transparent">
                Покупателям
              </NavigationMenuTrigger>
              <NavigationMenuContent className="z-50">
                <div className="grid w-[200px] gap-1 p-3 grid-cols-1 bg-white shadow-lg border rounded-md">
                  <NavigationMenuLink
                    className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 text-sm font-medium text-gray-900"
                    href="/promotions"
                  >
                    Акции
                  </NavigationMenuLink>
                  <NavigationMenuLink
                    className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 text-sm font-medium text-gray-900"
                    href="/info"
                  >
                    Информация
                  </NavigationMenuLink>
                  <NavigationMenuLink
                    className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 text-sm font-medium text-gray-900"
                    href="/gallery"
                  >
                    Галерея
                  </NavigationMenuLink>
                  <NavigationMenuLink
                    className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 text-sm font-medium text-gray-900"
                    href="/about"
                  >
                    О нас
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  "text-white hover:text-white hover:bg-white/10 bg-transparent"
                )}
                href="/visualizer"
              >
                Визуализатор
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  "text-white hover:text-white hover:bg-white/10 bg-transparent"
                )}
                href="/cooperation"
              >
                Сотрудничество
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  "text-white hover:text-white hover:bg-white/10 bg-transparent"
                )}
                href="/dealers"
              >
                Дилеры
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  "text-white hover:text-white hover:bg-white/10 bg-transparent"
                )}
                href="/contacts"
              >
                Контакты
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right side: Phone, Cart, Search */}
        <div className="flex items-center space-x-4">
          {/* Phone */}
          <div className="hidden md:flex items-center text-white">
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            <a
              href="tel:87751101800"
              className="text-sm font-medium hover:text-white/80"
            >
              8 (775) 110 1800
            </a>
          </div>

          {/* Search */}
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </Button>

          {/* Cart */}
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 relative"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13l2.5 5.5M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"
              />
            </svg>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              0
            </span>
          </Button>
        </div>
      </nav>

      {/* Hero Content */}
      <div
        className="relative z-10 flex items-center justify-start px-6 lg:px-8"
        style={{ height: "calc(100vh - 120px)" }}
      >
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

      {/* Mobile Navigation Menu (Hidden by default, you can add hamburger menu logic) */}
      <div className="md:hidden absolute top-6 right-6 z-20">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </Button>
      </div>
    </header>
  );
};

export default Header;
