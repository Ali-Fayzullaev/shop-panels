"use client";

import React, { useState } from "react";
import Link from "next/link";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, Menu, ChevronDown, X, Building, Grid3X3, Users, Eye, Handshake, MapPin, MessageCircle, Phone, Clock } from "lucide-react";
import { COMPANY_INFO } from "@/lib/company-info";

const Header = () => {
  const { getTotalItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isBuyersOpen, setIsBuyersOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50" style={{ backgroundColor: '#333333' }}>
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img 
            src={COMPANY_INFO.logo} 
            alt={COMPANY_INFO.name} 
            className="h-10 w-auto mr-3"
          />
          <h1 className="text-2xl font-bold text-white">
            {COMPANY_INFO.name}
          </h1>
        </Link>

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
                  <Link 
                    href="/bambukovye-paneli"
                    className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 text-sm font-medium text-gray-900"
                  >
                    Бамбуковые панели
                  </Link>
                  <Link 
                    href="/riflenye-paneli"
                    className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 text-sm font-medium text-gray-900"
                  >
                    Рифленые панели
                  </Link>
                  <Link 
                    href="/paneli-s-3d-pechatyu"
                    className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 text-sm font-medium text-gray-900"
                  >
                    Панели с 3D печатью
                  </Link>
                  <Link 
                    href="/alum"
                    className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 text-sm font-medium text-gray-900"
                  >
                    Вспененный алюминий
                  </Link>
                  <Link 
                    href="/flexible"
                    className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 text-sm font-medium text-gray-900"
                  >
                    Гибкая керамика
                  </Link>
                  <Link 
                    href="/montazhnye-profili"
                    className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 text-sm font-medium text-gray-900"
                  >
                    Монтажные профили
                  </Link>
                  <Link 
                    href="/sale"
                    className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 text-sm font-medium text-gray-900"
                  >
                    Акции
                  </Link>
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
                  <Link 
                    href="/sale"
                    className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 text-sm font-medium text-gray-900"
                  >
                    Акции
                  </Link>
                  <Link 
                    href="/catalog"
                    className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 text-sm font-medium text-gray-900"
                  >
                    Каталог
                  </Link>
                  <Link 
                    href="/visualizer"
                    className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 text-sm font-medium text-gray-900"
                  >
                    Визуализатор
                  </Link>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link
                href="/visualizer"
                className={cn(
                  navigationMenuTriggerStyle(),
                  "text-white hover:text-white hover:bg-white/10 bg-transparent"
                )}
              >
                Визуализатор
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link
                href="/book"
                className={cn(
                  navigationMenuTriggerStyle(),
                  "text-white hover:text-white hover:bg-white/10 bg-transparent"
                )}
              >
                Каталог-книга
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link
                href="/cooperation"
                className={cn(
                  navigationMenuTriggerStyle(),
                  "text-white hover:text-white hover:bg-white/10 bg-transparent"
                )}
              >
                Сотрудничество
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link
                href="/dealers"
                className={cn(
                  navigationMenuTriggerStyle(),
                  "text-white hover:text-white hover:bg-white/10 bg-transparent"
                )}
              >
                Дилеры
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link
                href="/contacts"
                className={cn(
                  navigationMenuTriggerStyle(),
                  "text-white hover:text-white hover:bg-white/10 bg-transparent"
                )}
              >
                Контакты
              </Link>
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
              href={`tel:${COMPANY_INFO.phoneClean}`}
              className="text-sm font-medium hover:text-white/80"
            >
              {COMPANY_INFO.phone}
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
          <Link href="/cart">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-white hover:bg-white/10"
            >
              <ShoppingCart className="w-5 h-5" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Button>
          </Link>

          {/* Mobile Navigation Menu */}
          <div className="lg:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10 transition-all duration-200"
                >
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-[320px] sm:w-[400px] bg-[#333333] border-l border-white/10"
              >
                <SheetHeader className="relative pb-6">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 text-white hover:bg-white/10 transition-all duration-200"
                    onClick={closeMobileMenu}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                  <div className="flex items-center space-x-3 pr-10">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                      <Building className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <SheetTitle className="text-white text-left">{COMPANY_INFO.name}</SheetTitle>
                      <SheetDescription className="text-white/70 text-left text-sm">
                        Стеновые панели премиум класса
                      </SheetDescription>
                    </div>
                  </div>
                </SheetHeader>
                
                <div className="space-y-3">
                  {/* Каталог с выпадающим меню */}
                  <Collapsible open={isCatalogOpen} onOpenChange={setIsCatalogOpen}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-3 text-left hover:bg-white/10 transition-all duration-200 text-white group">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-all duration-200">
                          <Grid3X3 className="w-4 h-4" />
                        </div>
                        <span className="font-medium">Каталог</span>
                      </div>
                      <ChevronDown className={cn("w-4 h-4 transition-all duration-300", isCatalogOpen && "rotate-180")} />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="ml-11 space-y-1 overflow-hidden">
                      <div className="border-l border-white/20 pl-4 space-y-1">
                        <Link 
                          href="/bambukovye-paneli"
                          className="block p-2 text-sm hover:bg-white/10 transition-all duration-200 text-white/90 hover:text-white"
                          onClick={closeMobileMenu}
                        >
                          🎋 Бамбуковые панели
                        </Link>
                        <Link 
                          href="/riflenye-paneli"
                          className="block p-2 text-sm hover:bg-white/10 transition-all duration-200 text-white/90 hover:text-white"
                          onClick={closeMobileMenu}
                        >
                          📐 Рифленые панели
                        </Link>
                        <Link 
                          href="/paneli-s-3d-pechatyu"
                          className="block p-2 text-sm hover:bg-white/10 transition-all duration-200 text-white/90 hover:text-white"
                          onClick={closeMobileMenu}
                        >
                          🎨 Панели с 3D печатью
                        </Link>
                        <Link 
                          href="/alum"
                          className="block p-2 text-sm hover:bg-white/10 transition-all duration-200 text-white/90 hover:text-white"
                          onClick={closeMobileMenu}
                        >
                          ⚡ Вспененный алюминий
                        </Link>
                        <Link 
                          href="/flexible"
                          className="block p-2 text-sm hover:bg-white/10 transition-all duration-200 text-white/90 hover:text-white"
                          onClick={closeMobileMenu}
                        >
                          🔄 Гибкая керамика
                        </Link>
                        <Link 
                          href="/montazhnye-profili"
                          className="block p-2 text-sm hover:bg-white/10 transition-all duration-200 text-white/90 hover:text-white"
                          onClick={closeMobileMenu}
                        >
                          🔧 Монтажные профили
                        </Link>
                        <Link 
                          href="/sale"
                          className="block p-2 text-sm hover:bg-white/10 transition-all duration-200 text-white/90 hover:text-white"
                          onClick={closeMobileMenu}
                        >
                          🏷️ Акции
                        </Link>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Покупателям с выпадающим меню */}
                  <Collapsible open={isBuyersOpen} onOpenChange={setIsBuyersOpen}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-3 text-left hover:bg-white/10 transition-all duration-200 text-white group">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-all duration-200">
                          <Users className="w-4 h-4" />
                        </div>
                        <span className="font-medium">Покупателям</span>
                      </div>
                      <ChevronDown className={cn("w-4 h-4 transition-all duration-300", isBuyersOpen && "rotate-180")} />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="ml-11 space-y-1 overflow-hidden">
                      <div className="border-l border-white/20 pl-4 space-y-1">
                        <Link 
                          href="/sale"
                          className="block p-2 text-sm hover:bg-white/10 transition-all duration-200 text-white/90 hover:text-white"
                          onClick={closeMobileMenu}
                        >
                          🔥 Акции
                        </Link>
                        <Link 
                          href="/catalog"
                          className="block p-2 text-sm hover:bg-white/10 transition-all duration-200 text-white/90 hover:text-white"
                          onClick={closeMobileMenu}
                        >
                          📋 Каталог
                        </Link>
                        <Link 
                          href="/visualizer"
                          className="block p-2 text-sm hover:bg-white/10 transition-all duration-200 text-white/90 hover:text-white"
                          onClick={closeMobileMenu}
                        >
                          👁️ Визуализатор
                        </Link>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Простые ссылки */}
                  <Link
                    href="/visualizer"
                    className="flex items-center space-x-3 p-3 font-medium hover:bg-white/10 transition-all duration-200 text-white group"
                    onClick={closeMobileMenu}
                  >
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-all duration-200">
                      <Eye className="w-4 h-4" />
                    </div>
                    <span>Визуализатор</span>
                  </Link>
                  
                  <Link
                    href="/book"
                    className="flex items-center space-x-3 p-3 font-medium hover:bg-white/10 transition-all duration-200 text-white group"
                    onClick={closeMobileMenu}
                  >
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-all duration-200">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <span>Каталог-книга</span>
                  </Link>
                  
                  <Link
                    href="/cooperation"
                    className="flex items-center space-x-3 p-3 font-medium hover:bg-white/10 transition-all duration-200 text-white group"
                    onClick={closeMobileMenu}
                  >
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-all duration-200">
                      <Handshake className="w-4 h-4" />
                    </div>
                    <span>Сотрудничество</span>
                  </Link>
                  
                  <Link
                    href="/dealers"
                    className="flex items-center space-x-3 p-3 font-medium hover:bg-white/10 transition-all duration-200 text-white group"
                    onClick={closeMobileMenu}
                  >
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-all duration-200">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span>Дилеры</span>
                  </Link>
                  
                  <Link
                    href="/contacts"
                    className="flex items-center space-x-3 p-3 font-medium hover:bg-white/10 transition-all duration-200 text-white group"
                    onClick={closeMobileMenu}
                  >
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-all duration-200">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <span>Контакты</span>
                  </Link>

                  {/* Разделитель */}
                  <div className="border-t border-white/20 my-6"></div>

                  {/* Контактная информация */}
                  <div className="space-y-3">
                    <a
                      href={`tel:${COMPANY_INFO.phoneClean}`}
                      className="flex items-center space-x-3 p-3 text-blue-300 hover:bg-white/10 transition-all duration-200 group"
                    >
                      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-all duration-200">
                        <Phone className="w-4 h-4 text-blue-300" />
                      </div>
                      <div>
                        <div className="font-medium">{COMPANY_INFO.phone}</div>
                        <div className="text-xs text-white/50">Позвонить сейчас</div>
                      </div>
                    </a>

                    <div className="flex items-center space-x-3 p-3 text-white/70">
                      <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-medium text-white">{COMPANY_INFO.workingHours}</div>
                        <div className="text-xs text-white/50">Режим работы</div>
                      </div>
                    </div>
                  </div>

                  {/* Кнопка "Заказать звонок" */}
                  <div className="pt-4">
                    <Button 
                      className="w-full bg-white text-[#333333] hover:bg-white/90 transition-all duration-200 font-medium"
                      onClick={closeMobileMenu}
                    >
                      📞 Заказать звонок
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;