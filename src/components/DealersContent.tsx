"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { MapPin, Phone, Building, User } from 'lucide-react';

// Определяем тип для дилера
interface Dealer {
  id: number;
  city: string;
  company: string;
  contact: string;
  entity: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

const dealers: Dealer[] = [
  {
    id: 1,
    city: "Алматы",
    company: "ART I SHOCK",
    contact: "+7 (727) 350-14-07",
    entity: "ТОО Артишок",
    address: "г. Алматы, пр. Абая 53, центральный вход",
    coordinates: { lat: 43.2389, lng: 76.9286 }
  },
  {
    id: 2,
    city: "Нур-Султан",
    company: "Capital Decor",
    contact: "+7 (7172) 55-75-57",
    entity: "ИП Даниярова А. Ж.",
    address: "г. Нур-Султан, ул. Мангилик Ел 28",
    coordinates: { lat: 51.1282, lng: 71.4308 }
  },
  {
    id: 3,
    city: "Шымкент",
    company: "South Design",
    contact: "+7 (7252) 45-14-21",
    entity: "ИП Кажгалиев Д. С.",
    address: "г. Шымкент, пр. Тауелсиздик 40",
    coordinates: { lat: 42.2951, lng: 69.6039 }
  },
  {
    id: 4,
    city: "Караганда",
    company: "MASTER DÉCOR",
    contact: "+7 (7212) 33-01-08",
    entity: "ИП Жанабаева Г. К.",
    address: "г. Караганда, ул. Гоголя 4, БЦ «Центральный»",
    coordinates: { lat: 49.8043, lng: 73.1247 }
  },
  {
    id: 5,
    city: "Актобе",
    company: "West Design",
    contact: "+7 (7132) 17-42-92",
    entity: "ТОО «WEST ДИЗАЙН»",
    address: "г. Актобе, ул. Абая 17",
    coordinates: { lat: 50.2872, lng: 50.2818 }
  },
  {
    id: 6,
    city: "Тараз",
    company: "DALI",
    contact: "+7 (7262) 71-48-61",
    entity: "ИП Абдуллаев Я. Г.",
    address: "г. Тараз, ул. Тауке хана 52",
    coordinates: { lat: 42.8998, lng: 71.3667 }
  },
  {
    id: 7,
    city: "Павлодар",
    company: "North Decor",
    contact: "+7 (7182) 22-18-84",
    entity: "ТОО «СЕВЕРНЫЙ ДЕКОР»",
    address: "г. Павлодар, ул. Ленина 125",
    coordinates: { lat: 52.2856, lng: 76.9574 }
  },
  {
    id: 8,
    city: "Усть-Каменогорск",
    company: "East Wall Design",
    contact: "+7 (7232) 94-72-18",
    entity: "ИП Сидоров А. В.",
    address: "г. Усть-Каменогорск, ул. Ленина 8В",
    coordinates: { lat: 50.0043, lng: 82.6003 }
  },
  {
    id: 9,
    city: "Семей",
    company: "East Decor",
    contact: "+7 (7222) 66-51-51",
    entity: "ИП Богданова Л. Г.",
    address: "г. Семей, ул. Абая 100",
    coordinates: { lat: 50.4183, lng: 80.2536 }
  },
  {
    id: 10,
    city: "Кызылорда",
    company: "BOGDANOVA Decor",
    contact: "+7 (7242) 11-40-90",
    entity: "ТОО «Стройкомплект»",
    address: "г. Кызылорда, ул. Амангельды 18д",
    coordinates: { lat: 44.8298, lng: 65.4503 }
  },
  {
    id: 11,
    city: "Атырау",
    company: "Онлайн декор",
    contact: "+7 (7122) 49-88-85",
    entity: "Онлайндекор.kz",
    address: "г. Атырау, пр. Достык 18, к2 151",
    coordinates: { lat: 47.1167, lng: 51.9167 }
  },
  {
    id: 12,
    city: "Петропавловск",
    company: "GRANIT EXPERT",
    contact: "+7 (7152) 11-40-90",
    entity: "ТОО «Стройкомплект»",
    address: "г. Петропавловск, ул. Ленина 39",
    coordinates: { lat: 54.8734, lng: 69.1561 }
  },
  {
    id: 13,
    city: "Туркестан",
    company: "ДЕКОР ИНТЕРЬЕР",
    contact: "+7 (7253) 06-53-47",
    entity: "ТОО «ДЕКОР ИНТЕРЬЕР»",
    address: "г. Туркестан, ул. Ауэзова 25",
    coordinates: { lat: 43.2867, lng: 68.2621 }
  },
  {
    id: 14,
    city: "Костанай",
    company: "Profildoors Mall",
    contact: "+7 (7142) 34-92-82",
    entity: "ИП Клепикова Н. П.",
    address: "г. Костанай, ул. Телмана 11",
    coordinates: { lat: 53.2056, lng: 63.6222 }
  },
  {
    id: 15,
    city: "Талдыкорган",
    company: "Дизайн центр",
    contact: "+7 (7282) 86-92-36",
    entity: "ИП Иванова-Корнеева",
    address: "г. Талдыкорган, ул. Абая 42",
    coordinates: { lat: 45.0142, lng: 78.3689 }
  }
];

const containerStyle = {
  width: '100%',
  height: '100%'
};

const defaultCenter = { lat: 51.1282, lng: 71.4308 }; // Нур-Султан

// Мемоизируем Google Maps API библиотеки
const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = [];

export default function DealersContent() {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(defaultCenter);
  const [mapZoom, setMapZoom] = useState<number>(5);
  const [mapHeight, setMapHeight] = useState<number>(500);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    const updateMapHeight = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setMapHeight(400);
      } else if (width < 1024) {
        setMapHeight(450);
      } else {
        setMapHeight(500);
      }
    };

    updateMapHeight();
    window.addEventListener('resize', updateMapHeight);
    return () => window.removeEventListener('resize', updateMapHeight);
  }, []);

  // Мемоизируем обработчики
  const handleCityClick = useCallback((dealer: Dealer) => {
    setSelectedCity(dealer.city);
    setMapCenter(dealer.coordinates);
    setMapZoom(12);
    setSelectedMarker(dealer.id);
  }, []);

  const handleMapLoad = useCallback(() => {
    setMapLoaded(true);
    setMapError(false);
  }, []);

  const handleMapError = useCallback(() => {
    setMapError(true);
    console.warn('Google Maps failed to load in dealers page, using fallback');
  }, []);

  const handleMarkerClick = useCallback((dealer: Dealer) => {
    setSelectedMarker(dealer.id);
    handleCityClick(dealer);
  }, [handleCityClick]);

  const handleInfoWindowClose = useCallback(() => {
    setSelectedMarker(null);
  }, []);

  const uniqueCities = useMemo(() => [...new Set(dealers.map(dealer => dealer.city))], []);

  // Получаем Google Maps API ключ
  const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  // Мемоизируем опции карты
  const mapOptions = useMemo(() => ({
    styles: [
      {
        featureType: "poi.business",
        stylers: [{ visibility: "off" }]
      }
    ],
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: true,
    streetViewControl: true,
    fullscreenControl: true
  }), []);
  
  // Если нет API ключа, показываем заглушку вместо карты
  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {/* Статистика */}
          <div className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="text-center bg-[#333333] p-6 text-white">
                <div className="text-3xl font-bold mb-2">15+</div>
                <p className="text-gray-300">Городов</p>
              </div>
              
              <div className="text-center bg-gray-50 p-6">
                <div className="text-3xl font-bold mb-2 text-[#333333]">20+</div>
                <p className="text-[#989898]">Партнеров</p>
              </div>
              
              <div className="text-center bg-gray-50 p-6">
                <div className="text-3xl font-bold mb-2 text-[#333333]">100%</div>
                <p className="text-[#989898]">Гарантия качества</p>
              </div>
            </div>
          </div>
          
          {/* Карта-заглушка */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div className="bg-gray-50 overflow-hidden shadow-lg">
              <div 
                className="h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 relative"
                style={{ height: `${mapHeight}px` }}
              >
                {/* Декоративная карта */}
                <div className="text-center p-8">
                  <div className="w-24 h-24 bg-[#333333] rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#333333] mb-2">
                    Наши дилеры по всему Казахстану
                  </h3>
                  <p className="text-[#989898] mb-4">
                    Выберите город из списка ниже для просмотра контактов
                  </p>
                </div>
                
                {/* Легенда */}
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-xl border border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-md">
                      <Building className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-800">Официальные дилеры</span>
                  </div>
                  <div className="text-xs text-gray-500 font-medium">
                    📍 {uniqueCities.length} городов • {dealers.length} партнеров
                  </div>
                </div>
              </div>
            </div>
            
            {/* Информация о дилерской программе */}
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-[#333333] mb-6">
                Официальные дилеры по Казахстану
              </h2>
              <p className="text-lg text-[#989898] mb-8 leading-relaxed">
                Наша дилерская сеть охватывает все крупные города Казахстана. Каждый партнер прошел 
                сертификацию и гарантирует высокое качество продукции и сервиса.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#333333] rounded-lg flex items-center justify-center">
                    <Building className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#333333]">Профессиональный подход</h4>
                    <p className="text-[#989898] text-sm">Квалифицированные консультанты в каждом салоне</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
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
              {uniqueCities.map((city) => {
                const dealer = dealers.find(d => d.city === city);
                return (
                  <button
                    key={city}
                    onClick={() => dealer && handleCityClick(dealer)}
                    className={`group flex items-center gap-2 px-4 py-3 font-medium transition-all duration-300 border shadow-sm hover:shadow-md hover:scale-105 ${
                      selectedCity === city
                        ? 'bg-blue-500 text-white border-blue-600'
                        : 'bg-white text-[#333333] border-gray-200 hover:bg-red-500 hover:text-white'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      selectedCity === city
                        ? 'bg-white'
                        : 'bg-red-500 group-hover:bg-white'
                    }`}>
                      <MapPin className={`h-2.5 w-2.5 ${
                        selectedCity === city
                          ? 'text-blue-500'
                          : 'text-white group-hover:text-red-500'
                      }`} />
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
              Наши дилеры в Казахстане
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dealers.map((dealer) => (
                <div 
                  key={dealer.id} 
                  className={`bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden ${
                    selectedCity === dealer.city ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => handleCityClick(dealer)}
                >
                  <div className="p-6 flex flex-col justify-between h-full cursor-pointer">
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
                            href={`tel:${dealer.contact.replace(/\s+/g, '')}`}
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
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCityClick(dealer);
                        }}
                        className="w-full py-3 px-4 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:scale-105"
                      >
                        <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
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
          <div className="text-center bg-[#333333] p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Хотите стать нашим дилером?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Присоединяйтесь к нашей партнерской программе и получите возможность продавать 
              высококачественные стеновые панели в вашем регионе
            </p>
            <a 
              href="/cooperation" 
              className="inline-flex items-center px-6 py-3 bg-white text-[#333333] font-semibold hover:bg-gray-100 transition-colors"
            >
              Узнать подробности
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Статистика */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center bg-[#333333] p-6 text-white">
              <div className="text-3xl font-bold mb-2">15+</div>
              <p className="text-gray-300">Городов</p>
            </div>
            
            <div className="text-center bg-gray-50 p-6">
              <div className="text-3xl font-bold mb-2 text-[#333333]">20+</div>
              <p className="text-[#989898]">Партнеров</p>
            </div>
            
            <div className="text-center bg-gray-50 p-6">
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
              {!mapError ? (
                <LoadScript 
                  googleMapsApiKey={GOOGLE_MAPS_API_KEY}
                  libraries={libraries}
                  onLoad={handleMapLoad}
                  onError={handleMapError}
                  preventGoogleFontsLoading={true}
                  loadingElement={
                    <div className="h-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#333333]"></div>
                    </div>
                  }
                >
                  <GoogleMap
                    mapContainerStyle={{ ...containerStyle, height: mapHeight }}
                    center={mapCenter}
                    zoom={mapZoom}
                    options={mapOptions}
                  >
                    {dealers.map((dealer) => (
                      <Marker
                        key={dealer.id}
                        position={dealer.coordinates}
                        icon={{
                          url: selectedCity === dealer.city
                            ? "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                            : "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                          scaledSize: mapLoaded && typeof window !== 'undefined' && window.google?.maps 
                            ? new window.google.maps.Size(32, 32) 
                            : undefined
                        }}
                        onClick={() => handleMarkerClick(dealer)}
                      />
                    ))}
                    
                    {selectedMarker !== null && (
                      <InfoWindow
                        position={dealers.find(d => d.id === selectedMarker)?.coordinates}
                        onCloseClick={handleInfoWindowClose}
                      >
                        <div className="p-2 max-w-xs bg-white">
                          <h3 className="font-bold text-gray-800 mb-1">{dealers.find(d => d.id === selectedMarker)?.city}</h3>
                          <p className="font-medium text-gray-700 mb-1">{dealers.find(d => d.id === selectedMarker)?.company}</p>
                          <p className="text-gray-600 text-sm mb-1">{dealers.find(d => d.id === selectedMarker)?.address}</p>
                          <p className="text-gray-600 text-sm mb-1">{dealers.find(d => d.id === selectedMarker)?.contact}</p>
                          <p className="text-gray-600 text-xs">{dealers.find(d => d.id === selectedMarker)?.entity}</p>
                        </div>
                      </InfoWindow>
                    )}
                  </GoogleMap>
                </LoadScript>
              ) : (
                // Fallback при ошибке загрузки карты
                <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 relative">
                  <div className="text-center p-8">
                    <div className="w-24 h-24 bg-[#333333] rounded-full flex items-center justify-center mx-auto mb-4">
                      <MapPin className="h-12 w-12 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-[#333333] mb-2">
                      Наши дилеры по всему Казахстану
                    </h3>
                    <p className="text-[#989898] mb-4">
                      Выберите город из списка ниже для просмотра контактов
                    </p>
                  </div>
                </div>
              )}
              
              {/* Легенда */}
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-xl border border-gray-200 z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-md">
                    <Building className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-800">Официальные дилеры</span>
                </div>
                <div className="text-xs text-gray-500 font-medium">
                  📍 {uniqueCities.length} городов • {dealers.length} партнеров
                </div>
              </div>
            </div>
          </div>
          
          {/* Информация о дилерской программе */}
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-[#333333] mb-6">
              Официальные дилеры по Казахстану
            </h2>
            <p className="text-lg text-[#989898] mb-8 leading-relaxed">
              Наша дилерская сеть охватывает все крупные города Казахстана. Каждый партнер прошел 
              сертификацию и гарантирует высокое качество продукции и сервиса.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#333333] rounded-lg flex items-center justify-center">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#333333]">Профессиональный подход</h4>
                  <p className="text-[#989898] text-sm">Квалифицированные консультанты в каждом салоне</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
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
            {uniqueCities.map((city) => {
              const dealer = dealers.find(d => d.city === city);
              return (
                <button
                  key={city}
                  onClick={() => dealer && handleCityClick(dealer)}
                  className={`group flex items-center gap-2 px-4 py-3 font-medium transition-all duration-300 border shadow-sm hover:shadow-md hover:scale-105 ${
                    selectedCity === city
                      ? 'bg-blue-500 text-white border-blue-600'
                      : 'bg-white text-[#333333] border-gray-200 hover:bg-red-500 hover:text-white'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                    selectedCity === city
                      ? 'bg-white'
                      : 'bg-red-500 group-hover:bg-white'
                  }`}>
                    <MapPin className={`h-2.5 w-2.5 ${
                      selectedCity === city
                        ? 'text-blue-500'
                        : 'text-white group-hover:text-red-500'
                    }`} />
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
            Наши дилеры в Казахстане
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dealers.map((dealer) => (
              <div 
                key={dealer.id} 
                className={`bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden ${
                  selectedCity === dealer.city ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => handleCityClick(dealer)}
              >
                <div className="p-6 flex flex-col justify-between h-full cursor-pointer">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="h-5 w-5 text-[#333333]" />
                      <h3 className="text-lg font-bold text-[#333333]">
                        {dealer.city}
                      </h3>
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCityClick(dealer);
                      }}
                      className="w-full py-3 px-4 bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:scale-105"
                    >
                      <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
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
        <div className="text-center bg-[#333333] p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">
            Хотите стать нашим дилером?
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Присоединяйтесь к нашей партнерской программе и получите возможность продавать 
            высококачественные стеновые панели в вашем регионе
          </p>
          <a 
            href="/cooperation" 
            className="inline-flex items-center px-6 py-3 bg-white text-[#333333] font-semibold hover:bg-gray-100 transition-colors"
          >
            Узнать подробности
          </a>
        </div>
      </div>
    </section>
  );
}
