"use client";

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Building, User } from 'lucide-react';
import { COMPANY_INFO, formatPhoneForCall } from "@/lib/company-info";

const dealers = [
  {
    id: 1,
    city: "Великий Новгород",
    company: "ART I SHOCK",
    contact: "+7 (911) 631-14-07",
    entity: "ООО Артишок",
    address: "г. Великий Новгород, ул. Московская 53, центральный вход"
  },
  {
    id: 2,
    city: "Владивосток",
    company: "Народный проспект",
    contact: "+7 (984) 199-75-57",
    entity: "ИП Дятлова Я. В.",
    address: "г. Владивосток, Народный проспект 28, вход через салон «Светский»"
  },
  {
    id: 3,
    city: "Владивосток",
    company: "АТЦ «Рондо»",
    contact: "+7 (924) 445-14-21",
    entity: "ИП Конечников Д. С.",
    address: "г. Владивосток, АТЦ «Рондо»"
  },
  {
    id: 4,
    city: "Благовещенск",
    company: "MASTER DÉCOR",
    contact: "+7 (914) 333-01-08",
    entity: "ИП Дятлова Я. В.",
    address: "г. Благовещенск, ул. Воронкова 4, БЦ «Статус»"
  },
  {
    id: 5,
    city: "Волгоград",
    company: "Оранж Дизайн",
    contact: "+7 (903) 317-42-92",
    entity: "ООО «ОРАНДЖ ДИЗАЙН»",
    address: "г. Волгоград, ул. 7 Гвардейской Дивизии 17"
  },
  {
    id: 6,
    city: "Владикавказ",
    company: "DALI",
    contact: "+7 (928) 071-48-61",
    entity: "ИП Кузнецов Я. Г.",
    address: "г. Владикавказ, ул. Весенняя 1а, центр «Весна»"
  },
  {
    id: 7,
    city: "Казань",
    company: "Villa Design",
    contact: "+7 (917) 399-11-15",
    entity: "ИП Кутузова Ю. Е.",
    address: "Республика Татарстан, г. Казань, ул. Сибгата Хакима 40"
  },
  {
    id: 8,
    city: "Киров",
    company: "Декор стен",
    contact: "+7 (900) 526-15-59",
    entity: "ИП Ворожцова Н. Н.",
    address: "г. Киров, ул. Солнечная 8В, салон «Декор стен»"
  },
  {
    id: 9,
    city: "Киров",
    company: "ТЦ «Загородный дом»",
    contact: "+7 (901) 666-51-51",
    entity: "ИП Богданова Л. Г.",
    address: "г. Киров, ТЦ «Загородный дом»"
  },
  {
    id: 10,
    city: "Иркутск",
    company: "BOGDANOVA Decor",
    contact: "+7 (913) 911-40-90",
    entity: "ООО «Стройкомплект»",
    address: "г. Иркутск, ул. Рабочая 18д, ТЦ «Фортуна. Стройматериалы»"
  },
  {
    id: 11,
    city: "Краснодар",
    company: "Онлайн декор",
    contact: "+7 (929) 849-88-85",
    entity: "Онлайндекор.рф",
    address: "г. Краснодар, ул. Шоссе Нефтяников 18, к2 151, 1 этаж"
  },
  {
    id: 12,
    city: "Новосибирск",
    company: "GRANIT EXPERT",
    contact: "+7 (913) 911-40-90",
    entity: "ООО «Стройкомплект»",
    address: "г. Новосибирск, ул. Фабричная 39, LOFT Ф39, вход А2"
  },
  {
    id: 13,
    city: "Москва",
    company: "ДЕКОР ИНТЕРЬЕР",
    contact: "+7 (926) 706-53-47",
    entity: "ООО «ДЕКОР ИНТЕРЬЕР»",
    address: "г. Москва, ул. Ленинградское шоссе, 25"
  },
  {
    id: 14,
    city: "Севастополь",
    company: "Profildoors Mall",
    contact: "+7 (978) 834-92-82",
    entity: "ИП Клепикова Н. П.",
    address: "г. Севастополь, ул. Токарева 11, фирменный салон Profildoors Mall"
  },
  {
    id: 15,
    city: "Симферополь",
    company: "Дизайн центр",
    contact: "+7 (978) 086-92-36",
    entity: "ИП Иванова-Корнеева",
    address: "г. Симферополь, ул. Генерала Васильева 42"
  }
];

export function DealersContent() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        
        {/* Статистика */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center bg-[#333333] rounded-lg p-6 text-white">
              <div className="text-3xl font-bold mb-2">15+</div>
              <p className="text-gray-300">Городов</p>
            </div>
            
            <div className="text-center bg-gray-50 rounded-lg p-6">
              <div className="text-3xl font-bold mb-2 text-[#333333]">20+</div>
              <p className="text-[#989898]">Партнеров</p>
            </div>
            
            <div className="text-center bg-gray-50 rounded-lg p-6">
              <div className="text-3xl font-bold mb-2 text-[#333333]">100%</div>
              <p className="text-[#989898]">Гарантия качества</p>
            </div>
          </div>
        </div>

        {/* Карта и описание */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          
          {/* Карта с кнопками городов */}
          <div className="bg-gray-50 rounded-lg overflow-hidden shadow-lg">
            <div className="h-full min-h-[400px] lg:min-h-[500px] relative">
              <iframe
                src="https://yandex.ru/map-widget/v1/?ll=66.923684%2C48.019573&z=4"
                width="100%"
                height="100%"
                frameBorder="0"
                className="border-0"
                title="Карта дилеров"
              ></iframe>
              
              {/* Красивые маркеры городов на карте */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Москва */}
                <div className="absolute top-[35%] left-[25%] pointer-events-auto">
                  <button 
                    onClick={() => window.open('https://yandex.ru/maps/213/moscow/?text=Ленинградское%20шоссе%2025', '_blank')}
                    className="group relative flex flex-col items-center cursor-pointer"
                    title="Москва - ДЕКОР ИНТЕРЬЕР"
                  >
                    <div className="w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110">
                      <Building className="h-4 w-4 text-white" />
                    </div>
                    <div className="mt-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-gray-800 shadow-md">
                      Москва
                    </div>
                  </button>
                </div>
                
                {/* Казань */}
                <div className="absolute top-[40%] left-[35%] pointer-events-auto">
                  <button 
                    onClick={() => window.open('https://yandex.ru/maps/43/kazan/?text=Сибгата%20Хакима%2040', '_blank')}
                    className="group relative flex flex-col items-center cursor-pointer"
                    title="Казань - Villa Design"
                  >
                    <div className="w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110">
                      <Building className="h-4 w-4 text-white" />
                    </div>
                    <div className="mt-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-gray-800 shadow-md">
                      Казань
                    </div>
                  </button>
                </div>
                
                {/* Новосибирск */}
                <div className="absolute top-[45%] left-[55%] pointer-events-auto">
                  <button 
                    onClick={() => window.open('https://yandex.ru/maps/65/novosibirsk/?text=Фабричная%2039', '_blank')}
                    className="group relative flex flex-col items-center cursor-pointer"
                    title="Новосибирск - GRANIT EXPERT"
                  >
                    <div className="w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110">
                      <Building className="h-4 w-4 text-white" />
                    </div>
                    <div className="mt-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-gray-800 shadow-md">
                      Новосибирск
                    </div>
                  </button>
                </div>
                
                {/* Владивосток */}
                <div className="absolute top-[55%] left-[85%] pointer-events-auto">
                  <button 
                    onClick={() => window.open('https://yandex.ru/maps/75/vladivostok/?text=Народный%20проспект%2028', '_blank')}
                    className="group relative flex flex-col items-center cursor-pointer"
                    title="Владивосток - Народный проспект"
                  >
                    <div className="w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110">
                      <Building className="h-4 w-4 text-white" />
                    </div>
                    <div className="mt-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-gray-800 shadow-md">
                      Владивосток
                    </div>
                  </button>
                </div>
                
                {/* Краснодар */}
                <div className="absolute top-[60%] left-[28%] pointer-events-auto">
                  <button 
                    onClick={() => window.open('https://yandex.ru/maps/35/krasnodar/?text=Шоссе%20Нефтяников%2018', '_blank')}
                    className="group relative flex flex-col items-center cursor-pointer"
                    title="Краснодар - Онлайн декор"
                  >
                    <div className="w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110">
                      <Building className="h-4 w-4 text-white" />
                    </div>
                    <div className="mt-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-gray-800 shadow-md">
                      Краснодар
                    </div>
                  </button>
                </div>
                
                {/* Волгоград */}
                <div className="absolute top-[55%] left-[32%] pointer-events-auto">
                  <button 
                    onClick={() => window.open('https://yandex.ru/maps/38/volgograd/?text=7%20Гвардейской%20Дивизии%2017', '_blank')}
                    className="group relative flex flex-col items-center cursor-pointer"
                    title="Волгоград - Оранж Дизайн"
                  >
                    <div className="w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110">
                      <Building className="h-4 w-4 text-white" />
                    </div>
                    <div className="mt-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-gray-800 shadow-md">
                      Волгоград
                    </div>
                  </button>
                </div>
                
                {/* Великий Новгород */}
                <div className="absolute top-[30%] left-[20%] pointer-events-auto">
                  <button 
                    onClick={() => window.open('https://yandex.ru/maps/24/veliky-novgorod/?text=Московская%2053', '_blank')}
                    className="group relative flex flex-col items-center cursor-pointer"
                    title="Великий Новгород - ART I SHOCK"
                  >
                    <div className="w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110">
                      <Building className="h-4 w-4 text-white" />
                    </div>
                    <div className="mt-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-gray-800 shadow-md">
                      В. Новгород
                    </div>
                  </button>
                </div>
                
                {/* Севастополь */}
                <div className="absolute top-[65%] left-[22%] pointer-events-auto">
                  <button 
                    onClick={() => window.open('https://yandex.ru/maps/959/sevastopol/?text=Токарева%2011', '_blank')}
                    className="group relative flex flex-col items-center cursor-pointer"
                    title="Севастополь - Profildoors Mall"
                  >
                    <div className="w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110">
                      <Building className="h-4 w-4 text-white" />
                    </div>
                    <div className="mt-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-gray-800 shadow-md">
                      Севастополь
                    </div>
                  </button>
                </div>
              </div>
              
              {/* Красивая легенда */}
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-xl border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-md">
                    <Building className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-800">Официальные дилеры</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-red-500" />
                  <span className="text-xs text-gray-600">Кликните для перехода на карту</span>
                </div>
                <div className="text-xs text-gray-500 font-medium">
                  📍 {Array.from(new Set(dealers.map(dealer => dealer.city))).length} городов • {dealers.length} партнеров
                </div>
              </div>
            </div>
          </div>

          {/* Информация о дилерской программе */}
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-[#333333] mb-6">
              Партнерская сеть по всей стране
            </h2>
            <p className="text-[#989898] mb-6 leading-relaxed">
              Наши официальные дилеры предоставляют полный спектр услуг: от консультации до установки. 
              Все партнеры прошли обучение и имеют сертификаты качества.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#333333] rounded-lg flex items-center justify-center">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#333333]">Официальные партнеры</h4>
                  <p className="text-[#989898] text-sm">Сертифицированные дилеры с гарантией</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#333333] rounded-lg flex items-center justify-center">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#333333]">Прямая связь</h4>
                  <p className="text-[#989898] text-sm">Контакты для быстрой консультации</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#333333] rounded-lg flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#333333]">Удобное расположение</h4>
                  <p className="text-[#989898] text-sm">Салоны в центральных районах городов</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Быстрый доступ к городам */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-[#333333] mb-6 text-center">
            Быстрый переход к городам
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {Array.from(new Set(dealers.map(dealer => dealer.city))).map((city) => {
              const cityLinks: { [key: string]: string } = {
                'Москва': 'https://yandex.ru/maps/213/moscow/?text=Ленинградское%20шоссе%2025',
                'Казань': 'https://yandex.ru/maps/43/kazan/?text=Сибгата%20Хакима%2040',
                'Новосибирск': 'https://yandex.ru/maps/65/novosibirsk/?text=Фабричная%2039',
                'Владивосток': 'https://yandex.ru/maps/75/vladivostok/?text=Народный%20проспект%2028',
                'Краснодар': 'https://yandex.ru/maps/35/krasnodar/?text=Шоссе%20Нефтяников%2018',
                'Волгоград': 'https://yandex.ru/maps/38/volgograd/?text=7%20Гвардейской%20Дивизии%2017',
                'Великий Новгород': 'https://yandex.ru/maps/24/veliky-novgorod/?text=Московская%2053',
                'Севастополь': 'https://yandex.ru/maps/959/sevastopol/?text=Токарева%2011',
                'Симферополь': 'https://yandex.ru/maps/146/simferopol/?text=Генерала%20Васильева%2042',
                'Владикавказ': 'https://yandex.ru/maps/33/vladikavkaz/?text=Весенняя%201а',
                'Киров': 'https://yandex.ru/maps/46/kirov/?text=Солнечная%208В',
                'Иркутск': 'https://yandex.ru/maps/63/irkutsk/?text=Рабочая%2018д',
                'Благовещенск': 'https://yandex.ru/maps/77/blagoveshchensk/?text=Воронкова%204'
              };
              
              return (
                <button
                  key={city}
                  onClick={() => window.open(cityLinks[city] || `https://yandex.ru/maps/?text=${encodeURIComponent(city)}`, '_blank')}
                  className="group flex items-center gap-2 px-4 py-3 bg-white hover:bg-red-500 hover:text-white text-[#333333] rounded-lg font-medium transition-all duration-300 border border-gray-200 shadow-sm hover:shadow-md hover:scale-105"
                >
                  <div className="w-4 h-4 bg-red-500 group-hover:bg-white rounded-full flex items-center justify-center">
                    <MapPin className="h-2.5 w-2.5 text-white group-hover:text-red-500" />
                  </div>
                  {city}
                </button>
              );
            })}
          </div>
        </div>

        {/* Список дилеров */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-[#333333] mb-8 text-center">
            Наши дилеры
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dealers.map((dealer) => (
              <div key={dealer.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <div className="aspect-square p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="h-5 w-5 text-[#333333]" />
                      <h3 className="text-lg font-bold text-[#333333]">
                        {dealer.city}
                      </h3>
                    </div>
                    
                    <h4 className="text-md font-semibold text-[#333333] mb-3">
                      {dealer.company}
                    </h4>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-start gap-2">
                        <Phone className="h-4 w-4 text-[#333333] mt-1 shrink-0" />
                        <a 
                          href={`tel:${dealer.contact}`}
                          className="text-[#989898] hover:text-[#333333] transition-colors text-sm"
                        >
                          {dealer.contact}
                        </a>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <User className="h-4 w-4 text-[#333333] mt-1 shrink-0" />
                        <span className="text-[#989898] text-sm">
                          {dealer.entity}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-auto">
                    <div className="flex items-start gap-2 mb-3">
                      <MapPin className="h-4 w-4 text-[#333333] mt-1 shrink-0" />
                      <p className="text-[#989898] text-sm leading-relaxed">
                        {dealer.address}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => {
                        const cityLinks: { [key: string]: string } = {
                          'Москва': 'https://yandex.ru/maps/213/moscow/?text=Ленинградское%20шоссе%2025',
                          'Казань': 'https://yandex.ru/maps/43/kazan/?text=Сибгата%20Хакима%2040',
                          'Новосибирск': 'https://yandex.ru/maps/65/novosibirsk/?text=Фабричная%2039',
                          'Владивосток': 'https://yandex.ru/maps/75/vladivostok/?text=Народный%20проспект%2028',
                          'Краснодар': 'https://yandex.ru/maps/35/krasnodar/?text=Шоссе%20Нефтяников%2018',
                          'Волгоград': 'https://yandex.ru/maps/38/volgograd/?text=7%20Гвардейской%20Дивизии%2017',
                          'Великий Новгород': 'https://yandex.ru/maps/24/veliky-novgorod/?text=Московская%2053',
                          'Севастополь': 'https://yandex.ru/maps/959/sevastopol/?text=Токарева%2011',
                          'Симферополь': 'https://yandex.ru/maps/146/simferopol/?text=Генерала%20Васильева%2042',
                          'Владикавказ': 'https://yandex.ru/maps/33/vladikavkaz/?text=Весенняя%201а',
                          'Киров': 'https://yandex.ru/maps/46/kirov/?text=Солнечная%208В',
                          'Иркутск': 'https://yandex.ru/maps/63/irkutsk/?text=Рабочая%2018д',
                          'Благовещенск': 'https://yandex.ru/maps/77/blagoveshchensk/?text=Воронкова%204'
                        };
                        window.open(cityLinks[dealer.city] || `https://yandex.ru/maps/?text=${encodeURIComponent(dealer.address)}`, '_blank');
                      }}
                      className="group w-full py-3 px-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:scale-105"
                    >
                      <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                        <MapPin className="h-3 w-3" />
                      </div>
                      Показать на карте
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Призыв к действию */}
        <div className="text-center bg-[#333333] rounded-lg p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">
            Хотите стать нашим дилером?
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Присоединяйтесь к нашей партнерской программе и получите возможность продавать 
            качественные стеновые панели с высокой маржинальностью
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={formatPhoneForCall(COMPANY_INFO.phoneClean)}
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#333333] font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Phone className="h-5 w-5 mr-2" />
              Связаться с нами
            </a>
            <Link
              href="/contacts"
              className="inline-flex items-center justify-center px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-[#333333] transition-colors"
            >
              Подробнее
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}