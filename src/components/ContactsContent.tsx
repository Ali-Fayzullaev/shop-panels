"use client";

import React, { useState } from 'react';
import { MapPin, Phone, Clock, Mail, Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { COMPANY_INFO, formatPhoneForCall } from "@/lib/company-info";

const locations = [
  {
    id: 1,
    title: "Главный офис",
    address: COMPANY_INFO.address,
    phone: COMPANY_INFO.phone,
    hours: COMPANY_INFO.workingHours,
    description: "Основной офис компании с полным ассортиментом панелей"
  }
];

export function ContactsContent() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "+7",
    email: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Здесь будет API запрос
    setTimeout(() => {
      console.log("Form submitted:", formData);
      setIsSubmitting(false);
      // Сброс формы
      setFormData({ name: "", phone: "+7", email: "", message: "" });
      alert("Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.");
    }, 2000);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        
        {/* Быстрые контакты */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <a 
              href={formatPhoneForCall(COMPANY_INFO.phoneClean)}
              className="group bg-[#333333] rounded-lg p-6 hover:bg-[#333333]/80 transition-all duration-300 text-white text-center"
            >
              <Phone className="h-8 w-8 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold mb-2">Позвоните нам</h3>
              <p className="text-gray-300">{COMPANY_INFO.phone}</p>
            </a>
            
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <Clock className="h-8 w-8 mx-auto mb-3 text-[#333333]" />
              <h3 className="font-semibold mb-2 text-[#333333]">Режим работы</h3>
              <p className="text-[#989898]">{COMPANY_INFO.workingHours}</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 text-center">
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
              <div key={location.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
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
          
          {/* Карта */}
          <div className="bg-gray-50 rounded-lg overflow-hidden shadow-lg">
            <div className="h-full min-h-[500px]">
              <iframe
                src="https://yandex.ru/map-widget/v1/?um=constructor%3A8f4c5d89f0a6b3c7e2d9a1f4c8e6b2d5a9c3f7e1b4d8c2f6a9e3d7b1c5f9a2e6&amp;source=constructor"
                width="100%"
                height="100%"
                frameBorder="0"
                className="border-0"
                title="Карта с нашими офисами"
              ></iframe>
            </div>
          </div>

          {/* Форма обратной связи */}
          <div id="contact-form" className="bg-[#333333] rounded-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-6 text-center">
              Оставьте заявку
            </h3>
            <p className="text-gray-300 mb-8 text-center">
              Мы свяжемся с вами в течение 15 минут
            </p>
            
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