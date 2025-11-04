"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const Header = () => {
  // Массив изображений для слайдшоу
  const heroImages = [
    '/images/wall.png',
    '/images/wall1.jpg',
    // '/images/wall2.png',
    // '/images/wall3.png',
    // '/images/wall4.png',
    // '/images/wall5.jpg',
    // '/images/wall6.png'
  ]

  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Автоматическое переключение изображений каждые 5 секунд
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      )
    }, 5000) // 5 секунд

    return () => clearInterval(interval)
  }, [heroImages.length])

  return (
    <header className="relative min-h-screen">
      {/* Hero Background with Slideshow */}
      <div className="absolute inset-0 z-0">
        <div className="relative h-full w-full overflow-hidden">
          {heroImages.map((image, index) => (
            <div
              key={image}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
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
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-white">WallPanels</h1>
        </div>

        {/* Navigation Menu */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  "text-white hover:text-white hover:bg-white/10 bg-transparent"
                )}
                href="/"
              >
                Главная
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  "text-white hover:text-white hover:bg-white/10 bg-transparent"
                )}
                href="/catalog"
              >
                Каталог
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  "text-white hover:text-white hover:bg-white/10 bg-transparent"
                )}
                href="/gallery"
              >
                Галерея
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  "text-white hover:text-white hover:bg-white/10 bg-transparent"
                )}
                href="/services"
              >
                Услуги
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

        {/* CTA Button */}
        <Button 
          variant="outline" 
          className="bg-white/10 border-white text-white hover:bg-white hover:text-black backdrop-blur-sm"
        >
          Получить консультацию
        </Button>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 flex items-center justify-start px-6 lg:px-8" style={{ height: 'calc(100vh - 120px)' }}>
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
            Преобразите ваше пространство с помощью наших премиальных стеновых панелей. 
            Качество, стиль и долговечность в каждом решении.
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
  )
}

export default Header