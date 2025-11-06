"use client";

import React, { useState } from 'react';
import { TrendingUp, Users, Award, HeadphonesIcon, DollarSign, Building, Phone, Mail, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

const advantages = [
  {
    id: 1,
    icon: Award,
    title: "Инновационный товар",
    description: "Панели обладают уникальными качествами, что делает их востребованными на рынке. Это гарантирует нашим партнерам высокий спрос, постоянный доход и стабильный клиентский поток."
  },
  {
    id: 2,
    icon: Building,
    title: "Большой склад",
    description: "В наличии большое количество складских позиций, готовых к отгрузке. Это позволяет быстро реагировать на заказы наших партнёров и обеспечивать короткие сроки поставок."
  },
  {
    id: 3,
    icon: TrendingUp,
    title: "Многообразие интерьерных решений",
    description: "Предоставляем возможность изготовления панелей по индивидуальному заказу и индивидуальным размерам с нанесением любого высококачественного изображения."
  },
  {
    id: 4,
    icon: Users,
    title: "Персональный менеджер",
    description: "Мы предлагаем партнёрам персонального менеджера, чтобы сотрудничество с нами было комфортным на всех этапах, и стремимся обеспечить эффективный результат взаимодействия."
  }
];

const cooperationTypes = [
  {
    id: 1,
    title: "Дилерство",
    price: "От 500 000 ₽",
    description: "Стандартная партнерская программа",
    features: [
      "Скидка до 30% от розничной цены",
      "Маркетинговая поддержка",
      "Обучение персонала",
      "Техническая поддержка",
      "Образцы продукции"
    ],
    popular: false
  },
  {
    id: 2,
    title: "Франшиза",
    price: "От 1 500 000 ₽",
    description: "Полноценный бизнес под ключ",
    features: [
      "Готовая бизнес-модель",
      "Фирменный стиль и брендинг",
      "Эксклюзивная территория",
      "Скидка до 40% от розничной цены",
      "Полное сопровождение бизнеса",
      "Рекламные материалы",
      "CRM система"
    ],
    popular: true
  },
  {
    id: 3,
    title: "Оптовые закупки",
    price: "От 100 000 ₽",
    description: "Для строительных компаний",
    features: [
      "Оптовые цены",
      "Гибкие условия оплаты",
      "Доставка по регионам",
      "Техническая поддержка",
      "Консультации по монтажу"
    ],
    popular: false
  }
];

export function CooperationContent() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    phone: "+7",
    email: "",
    city: "",
    cooperationType: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      console.log("Cooperation form submitted:", formData);
      setIsSubmitting(false);
      setFormData({ name: "", company: "", phone: "+7", email: "", city: "", cooperationType: "", message: "" });
      alert("Спасибо за интерес к сотрудничеству! Мы свяжемся с вами в ближайшее время.");
    }, 2000);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        
        {/* Преимущества сотрудничества */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
              Почему выбирают нас?
            </h2>
            <p className="text-lg text-[#989898] max-w-2xl mx-auto">
              Мы предлагаем лучшие условия для развития вашего бизнеса
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {advantages.map((advantage) => {
              const IconComponent = advantage.icon;
              return (
                <div key={advantage.id} className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="h-6 w-6 text-[#333333]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#333333] mb-3">
                    {advantage.title}
                  </h3>
                  <p className="text-[#989898] leading-relaxed text-sm">
                    {advantage.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>


        {/* Форма заявки и контакты */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Форма заявки */}
          <div className="bg-[#333333] rounded-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-6 text-center">
              Заявка на сотрудничество
            </h3>
            <p className="text-gray-300 mb-8 text-center">
              Оставьте заявку и получите персональное коммерческое предложение
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Имя *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="Ваше имя"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Компания
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="Название компании"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Телефон *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="+7 (000) 000-00-00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Город *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="Ваш город"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Тип сотрудничества
                  </label>
                  <select
                    name="cooperationType"
                    value={formData.cooperationType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                  >
                    <option value="" className="text-gray-800">Выберите тип</option>
                    <option value="dealer" className="text-gray-800">Дилерство</option>
                    <option value="franchise" className="text-gray-800">Франшиза</option>
                    <option value="wholesale" className="text-gray-800">Оптовые закупки</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Сообщение
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
                  placeholder="Расскажите о вашем бизнесе и планах..."
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
                    <Mail className="h-5 w-5 mr-2" />
                    Отправить заявку
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-400 text-center">
                Отправляя заявку, вы соглашаетесь с{" "}
                <a href="/privacy" className="text-gray-300 hover:text-white underline">
                  политикой конфиденциальности
                </a>
              </p>
            </form>
          </div>

          {/* Информация и контакты */}
          <div className="flex flex-col justify-center">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-[#333333] mb-4">
                Готовы к сотрудничеству?
              </h3>
              <p className="text-[#989898] mb-6 leading-relaxed">
                Наши менеджеры готовы обсудить условия партнерства, ответить на все вопросы 
                и помочь выбрать оптимальный формат сотрудничества для вашего бизнеса.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#333333] rounded-lg flex items-center justify-center shrink-0">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#333333] mb-1">Звоните прямо сейчас</h4>
                  <a href="tel:+79937021764" className="text-[#989898] hover:text-[#333333] transition-colors text-lg font-medium">
                    +7 (993) 702-17-64
                  </a>
                  <p className="text-sm text-[#989898]">Пн-Пт: 9:00 - 18:00</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#333333] rounded-lg flex items-center justify-center shrink-0">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#333333] mb-1">Или напишите нам</h4>
                  <p className="text-[#989898]">partnership@wallpanels.ru</p>
                  <p className="text-sm text-[#989898]">Ответим в течение 2 часов</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mt-8">
                <h4 className="font-semibold text-[#333333] mb-3">💡 Что дальше?</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-[#333333]" />
                    <span className="text-sm text-[#989898]">Обработаем заявку в течение 2 часов</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-[#333333]" />
                    <span className="text-sm text-[#989898]">Проведем консультацию по телефону</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-[#333333]" />
                    <span className="text-sm text-[#989898]">Подготовим персональное предложение</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-[#333333]" />
                    <span className="text-sm text-[#989898]">Заключим договор и начнем работу</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}