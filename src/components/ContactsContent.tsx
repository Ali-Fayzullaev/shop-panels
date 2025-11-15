"use client";

import React, { useState, useCallback, useMemo } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { MapPin, Phone, Clock, Mail, Send, Building } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { COMPANY_INFO, formatPhoneForCall } from "@/lib/company-info";

const locations = [
  {
    id: 1,
    title: "Главный офис",
    address: "Улица Анет баба, 9, Астана",
    phone: COMPANY_INFO.phone,
    hours: COMPANY_INFO.workingHours,
    description: "Основной офис компании с полным ассортиментом панелей",
    coordinates: { lat: 51.1694, lng: 71.4491 } // Координаты для Улица Анет баба, 9, Астана
  }
];

const containerStyle = {
  width: '100%',
  height: '100%'
};

const mapCenter = { lat: 51.1694, lng: 71.4491 }; // Координаты офиса

// Мемоизируем Google Maps API библиотеки
const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = [];

export function ContactsContent() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "+7",
    email: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Мемоизируем обработчики событий
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');
    
    try {
      console.log('🚀 Начинаем отправку заявки...');
      console.log('📝 Данные формы:', formData);
      
      // Проверяем заполненность обязательных полей
      if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim()) {
        throw new Error('Заполните все обязательные поля: имя, телефон и email');
      }
      
      console.log('📡 Отправляем запрос на /api/send-feedback...');
      
      const response = await fetch('/api/send-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('📊 Статус ответа:', response.status);
      console.log('📋 Headers ответа:', Object.fromEntries(response.headers));
      
      const responseText = await response.text();
      console.log('📄 Ответ сервера (RAW):', responseText);
      
      let result;
      try {
        result = JSON.parse(responseText);
        console.log('✅ Распарсенный результат:', result);
      } catch (parseError) {
        console.error('❌ Ошибка парсинга JSON:', parseError);
        console.error('🔤 Не удалось распарсить:', responseText.substring(0, 500));
        throw new Error(`Сервер вернул неверный формат данных: ${responseText.substring(0, 100)}...`);
      }

      if (response.ok && result.success) {
        console.log('🎉 Заявка успешно отправлена!');
        setSubmitStatus('success');
        setFormData({ name: "", phone: "+7", email: "", message: "" });
      } else {
        // Детальное логирование ошибки
        console.error('❌ Ошибка от API:');
        console.error('  - Status:', response.status);
        console.error('  - Success:', result.success);
        console.error('  - Message:', result.message);
        console.error('  - Error:', result.error);
        console.error('  - Note:', result.note);
        
        const errorMsg = result.message || result.error || `HTTP ${response.status}: ${response.statusText}`;
        setErrorMessage(errorMsg);
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('💥 Полная ошибка отправки:', error);
      
      let errorMsg = 'Произошла неизвестная ошибка при отправке заявки';
      if (error instanceof Error) {
        errorMsg = error.message;
        console.error('📜 Stack trace:', error.stack);
      }
      
      setErrorMessage(errorMsg);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      console.log('🏁 Завершение отправки заявки');
    }
  }, [formData]);

  // Мемоизируем обработчики Google Maps
  const handleMapLoad = useCallback(() => {
    setMapLoaded(true);
    setMapError(false);
  }, []);

  const handleMapError = useCallback(() => {
    setMapError(true);
    console.warn('Google Maps failed to load, using fallback');
  }, []);

  const handleMarkerClick = useCallback(() => {
    setSelectedMarker(locations[0].id);
  }, []);

  const handleInfoWindowClose = useCallback(() => {
    setSelectedMarker(null);
  }, []);

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

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        
        {/* Быстрые контакты */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <a 
              href={formatPhoneForCall(COMPANY_INFO.phoneClean)}
              className="group bg-[#333333] p-6 hover:bg-[#333333]/80 transition-all duration-300 text-white text-center"
            >
              <Phone className="h-8 w-8 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold mb-2">Позвоните нам</h3>
              <p className="text-gray-300">{COMPANY_INFO.phone}</p>
            </a>
            
            <div className="bg-gray-50 p-6 text-center">
              <Clock className="h-8 w-8 mx-auto mb-3 text-[#333333]" />
              <h3 className="font-semibold mb-2 text-[#333333]">Режим работы</h3>
              <p className="text-[#989898]">{COMPANY_INFO.workingHours}</p>
            </div>
            
            <div className="bg-gray-50 p-6 text-center">
              <MapPin className="h-8 w-8 mx-auto mb-3 text-[#333333]" />
              <h3 className="font-semibold mb-2 text-[#333333]">Офис в Астане</h3>
              <p className="text-[#989898]">1 локация</p>
            </div>
          </div>
        </div>

        {/* Офисы - квадратный дизайн */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
              Наш офис
            </h2>
            <p className="text-lg text-[#989898] max-w-2xl mx-auto">
              Приезжайте к нам, чтобы увидеть качество панелей своими глазами
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
            {locations.map((location) => (
              <div key={location.id} className="bg-gray-50 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="aspect-square p-8 flex flex-col justify-center">
                  <h3 className="text-2xl font-bold text-[#333333] mb-6 text-center">
                    {location.title}
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-6 w-6 text-[#333333] mt-1 shrink-0" />
                      <span className="text-[#989898] leading-relaxed">{location.address}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Phone className="h-6 w-6 text-[#333333] shrink-0" />
                      <a 
                        href={`tel:${location.phone}`} 
                        className="text-[#989898] hover:text-[#333333] transition-colors font-medium"
                      >
                        {location.phone}
                      </a>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Clock className="h-6 w-6 text-[#333333] mt-1 shrink-0" />
                      <span className="text-[#989898] leading-relaxed">{location.hours}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-[#989898] mt-6 text-center italic">
                    {location.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Карта и форма */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Google Maps */}
          <div className="bg-gray-50 rounded-lg overflow-hidden shadow-lg">
            <div className="h-full min-h-[500px] relative">
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
                    mapContainerStyle={{ ...containerStyle, height: '500px' }}
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
                          : undefined
                      }}
                    />
                    
                    {selectedMarker !== null && (
                      <InfoWindow
                        position={locations[0].coordinates}
                        onCloseClick={handleInfoWindowClose}
                      >
                        <div className="p-3 max-w-xs">
                          <h3 className="font-bold text-gray-800 mb-2">{locations[0].title}</h3>
                          <p className="text-gray-600 text-sm mb-2">{locations[0].address}</p>
                          <p className="text-gray-600 text-sm mb-2">{locations[0].phone}</p>
                          <p className="text-gray-600 text-xs">{locations[0].hours}</p>
                        </div>
                      </InfoWindow>
                    )}
                  </GoogleMap>
                </LoadScript>
              ) : (
                // Fallback если нет API ключа или произошла ошибка
                <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 relative">
                  <div className="text-center p-8">
                    <div className="w-24 h-24 bg-[#333333] rounded-full flex items-center justify-center mx-auto mb-4">
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
                        const mapUrl = `https://yandex.com/maps/?text=${encodeURIComponent("Улица Анет баба, 9, Астана")}&z=16`;
                        window.open(mapUrl, '_blank');
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#333333] text-white rounded-lg hover:bg-[#333333]/80 transition-colors"
                    >
                      <MapPin className="h-4 w-4" />
                      Открыть в Яндекс.Картах
                    </button>
                  </div>
                </div>
              )}
              
              {/* Легенда */}
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-xl border border-gray-200 z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-md">
                    <Building className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-800">Главный офис</span>
                </div>
                <div className="text-xs text-gray-500 font-medium">
                  📍 Улица Анет баба, 9 • Астана
                </div>
              </div>
            </div>
          </div>

          {/* Форма обратной связи */}
          <div id="contact-form" className="bg-[#333333] p-8 text-white">
            <h3 className="text-2xl font-bold mb-6 text-center">
              Оставьте заявку
            </h3>
            <p className="text-gray-300 mb-8 text-center">
              Мы свяжемся с вами в течение 15 минут
            </p>
            
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 text-center">
                ✅ Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-center">
                ❌ Произошла ошибка при отправке. Попробуйте позже или позвоните нам.
                {errorMessage && <p className="mt-2 text-red-400">{errorMessage}</p>}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Ваше имя *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors"
                  placeholder="Введите ваше имя"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                  Телефон *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors"
                  placeholder="+7 (000) 000-00-00"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors"
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Сообщение
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors resize-none"
                  placeholder="Расскажите о вашем проекте..."
                />
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-4 text-lg font-semibold bg-white hover:bg-gray-100 text-[#333333] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#333333] mr-2"></div>
                    Отправляем...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Отправить заявку
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-400 text-center leading-relaxed">
                Нажимая кнопку, вы соглашаетесь с{" "}
                <a href="/privacy" className="text-gray-300 hover:text-white underline">
                  политикой конфиденциальности
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}