"use client";

import React from "react";
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

  return (
    <header className="sticky top-0 z-50" style={{ backgroundColor: '#333333' }}>
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-white">
            WallPanels
          </h1>
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
                    href="/bambukovye-paneli"
                  >
                    Бамбуковые панели
                  </NavigationMenuLink>
                  <NavigationMenuLink
                    className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 text-sm font-medium text-gray-900"
                    href="/riflenye-paneli"
                  >
                    Рифленые панели
                  </NavigationMenuLink>
                  <NavigationMenuLink
                    className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 text-sm font-medium text-gray-900"
                    href="/paneli-s-3d-pechatyu"
                  >
                    Панели с 3D печатью
                  </NavigationMenuLink>
                  <NavigationMenuLink
                    className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 text-sm font-medium text-gray-900"
                    href="/alum"
                  >
                    Вспененный алюминий
                  </NavigationMenuLink>
                  <NavigationMenuLink
                    className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 text-sm font-medium text-gray-900"
                    href="/flexible"
                  >
                    Гибкая керамика
                  </NavigationMenuLink>
                  <NavigationMenuLink
                    className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 text-sm font-medium text-gray-900"
                    href="/montazhnye-profili"
                  >
                    Монтажные профили
                  </NavigationMenuLink>
                  <NavigationMenuLink
                    className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 text-sm font-medium text-gray-900"
                    href="/sale"
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
            className="relative text-white hover:bg-white/10"
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

        {/* Mobile Navigation Menu (Hidden by default, you can add hamburger menu logic) */}
        <div className="md:hidden">
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
      </nav>
    </header>
  );
};

export default Header;
