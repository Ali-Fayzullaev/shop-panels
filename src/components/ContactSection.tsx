"use client";

import React, { useState, useCallback, useMemo } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { MapPin, Phone, Clock, Building } from "lucide-react";
import { COMPANY_INFO, formatPhoneForCall } from "@/lib/company-info";

const locations = [
  {
    id: 1,
    title: "Главный офис",
    address: "Улица Анет баба, 9, Астана",
    phone: COMPANY_INFO.phone,
    hours: COMPANY_INFO.workingHours,
    coordinates: { lat: 51.1694, lng: 71.4491 }, // Координаты для Улица Анет баба, 9, Астана
  },
];

const containerStyle = {
  width: "100%",
  height: "100%",
};

const mapCenter = { lat: 51.1694, lng: 71.4491 }; // Координаты офиса

// Мемоизируем Google Maps API библиотеки
const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = [];

export function ContactSection() {
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  // Получаем Google Maps API ключ
  const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  // Мемоизируем обработчики
  const handleMapLoad = useCallback(() => {
    setMapLoaded(true);
    setMapError(false);
  }, []);

  const handleMapError = useCallback(() => {
    setMapError(true);
    console.warn('Google Maps failed to load in contact section, using fallback');
  }, []);

  const handleMarkerClick = useCallback(() => {
    setSelectedMarker(locations[0].id);
  }, []);

  const handleInfoWindowClose = useCallback(() => {
    setSelectedMarker(null);
  }, []);

  // Мемоизируем опции карты
  const mapOptions = useMemo(() => ({
    styles: [
      {
        featureType: "poi.business",
        stylers: [{ visibility: "off" }],
      },
    ],
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: true,
    streetViewControl: true,
    fullscreenControl: true,
  }), []);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
            Как нас найти
          </h2>
          <p className="text-lg text-[#989898] max-w-2xl mx-auto">
            Приходите к нам в офис или шоурум, чтобы посмотреть образцы панелей
            вживую и получить консультацию
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Карточки с адресами */}
          <div className="space-y-6">
            {locations.map((location) => (
              <div
                key={location.id}
                className="bg-white p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="text-xl font-bold text-[#333333] mb-4">
                  {location.title}
                </h3>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-[#333333] mt-1 shrink-0" />
                    <span className="text-[#989898]">{location.address}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-[#333333] shrink-0" />
                    <a
                      href={`tel:${location.phone}`}
                      className="text-[#989898] hover:text-[#333333] transition-colors"
                    >
                      {location.phone}
                    </a>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-[#333333] shrink-0" />
                    <span className="text-[#989898]">{location.hours}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Контактная информация */}
          <div className="bg-[#333333] p-8 text-white flex flex-col justify-center">
            <h3 className="text-2xl font-bold mb-6">Свяжитесь с нами</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Наши опытные консультанты готовы помочь вам выбрать идеальные панели. Наши
              специалисты помогут выбрать идеальные панели для вашего проекта.
            </p>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 shrink-0" />
              <a
                href={formatPhoneForCall(COMPANY_INFO.phoneClean)}
                className="text-lg font-semibold hover:text-gray-300 transition-colors"
              >
                {COMPANY_INFO.phone}
              </a>
            </div>
          </div>

          {/* Google Maps */}
          <div className="bg-white overflow-hidden shadow-md">
            <div className="h-full min-h-[400px] lg:min-h-[500px] relative">
              {GOOGLE_MAPS_API_KEY && !mapError ? (
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
                    mapContainerStyle={{ ...containerStyle, height: "500px" }}
                    center={mapCenter}
                    zoom={16}
                    options={mapOptions}
                  >
                    <Marker
                      position={locations[0].coordinates}
                      onClick={handleMarkerClick}
                      icon={{
                        url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                        scaledSize: mapLoaded && typeof window !== 'undefined' && window.google?.maps 
                          ? new window.google.maps.Size(32, 32) 
                          : undefined,
                      }}
                    />

                    {selectedMarker !== null && (
                      <InfoWindow
                        position={locations[0].coordinates}
                        onCloseClick={handleInfoWindowClose}
                      >
                        <div className="p-3 max-w-xs">
                          <h3 className="font-bold text-gray-800 mb-2">
                            {locations[0].title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2">
                            {locations[0].address}
                          </p>
                          <p className="text-gray-600 text-sm mb-2">
                            {locations[0].phone}
                          </p>
                          <p className="text-gray-600 text-xs">
                            {locations[0].hours}
                          </p>
                        </div>
                      </InfoWindow>
                    )}
                  </GoogleMap>
                </LoadScript>
              ) : (
                // Fallback если нет API ключа или произошла ошибка
                <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 relative">
                  <div className="text-center p-8">
                    <div className="w-24 h-24 bg-[#333333] flex items-center justify-center mx-auto mb-4">
                      <Building className="h-12 w-12 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-[#333333] mb-2">
                      Наш офис в Астане
                    </h3>
                    <p className="text-[#989898] mb-4">
                      Улица Анет баба, 9, Астана
                    </p>
                    <button
                      onClick={() => {
                        const mapUrl = `https://yandex.com/maps/?text=${encodeURIComponent(
                          "Улица Анет баба, 9, Астана"
                        )}&z=16`;
                        window.open(mapUrl, "_blank");
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#333333] text-white hover:bg-[#333333]/80 transition-colors"
                    >
                      <MapPin className="h-4 w-4" />
                      Открыть в Яндекс.Картах
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Призыв к действию */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-[#333333] mb-4">
            Приезжайте к нам в офис
          </h3>
          <p className="text-lg text-[#989898] mb-8 max-w-2xl mx-auto">
            Приезжайте к нам, чтобы увидеть качество панелей своими глазами
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={formatPhoneForCall(COMPANY_INFO.phoneClean)}
              className="inline-flex items-center justify-center px-6 py-3 bg-[#333333] hover:bg-[#333333]/80 text-white font-semibold transition-colors"
            >
              <Phone className="h-5 w-5 mr-2" />
              Позвонить
            </a>
            <a
              href={`https://yandex.com/maps/?text=${encodeURIComponent(
                "Улица Анет баба, 9, Астана"
              )}&z=16`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-white hover:bg-gray-50 text-[#333333] font-semibold border-2 border-[#333333] transition-colors"
            >
              <MapPin className="h-5 w-5 mr-2" />
              Открыть в картах
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
