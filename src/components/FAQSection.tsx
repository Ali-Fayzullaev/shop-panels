"use client";

import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { COMPANY_INFO } from "@/lib/company-info";

const faqData = [
  {
    id: 1,
    question: "Могу ли я самостоятельно установить стеновые панели?",
    answer: "Да, каждому покупателю мы предоставляем бумажную инструкцию и даём ссылку на видеоурок. Однако, если вы не уверены в своих навыках, лучше обратиться к профессионалам. Установка может потребовать инструмента и навыков."
  },
  {
    id: 2,
    question: "Какие преимущества установки стеновых панелей?",
    answer: "Установка стеновых панелей имеет ряд преимуществ, включая улучшение внешнего вида интерьера, увеличение тепло- и звукоизоляции, легкость монтажа, возможность скрыть дефекты стен, увеличение защиты стен от повреждений и легкость ухода."
  },
  {
    id: 3,
    question: "Есть ли у вас услуга монтажа? Сколько стоит?",
    answer: "Да, мы осуществляем монтаж панелей в Москве и области. Вы можете оставить заявку на получение индивидуального расчёта стоимости. Все работы выполняются «под ключ»."
  },
  {
    id: 4,
    question: "Царапается ли панель?",
    answer: "Панель стойкая к механическим повреждениям и может использоваться в качестве облицовки мебели/столешницы."
  },
  {
    id: 5,
    question: "Какой стиль и цвет панелей лучше выбрать?",
    answer: "Выбор стиля и цвета зависит от вашего дизайнерского вкуса и общего стиля интерьера. Рекомендуется выбирать панели, которые гармонируют с мебелью и остальными элементами в помещении."
  },
  {
    id: 6,
    question: "Какие размеры панели?",
    answer: "Стандартный размер сплошной панели 1100×2800 мм, но под заказ высота панели может быть до 6 метров."
  },
  {
    id: 7,
    question: "Какие условия доставки?",
    answer: `Мы осуществляем доставку товаров в любой регион Казахстана, где есть транспортное сообщение, доставка рассчитывается индивидуально в соответствии с тарифами транспортных компаний. Для уточнения стоимости доставки или по вопросу самовывоза вы можете связаться с нашими менеджерами по телефону ${COMPANY_INFO.phone}`
  },
  {
    id: 8,
    question: "Где можно посмотреть образцы панелей?",
    answer: `Вы можете посмотреть образцы в нашем офисе по адресу ${COMPANY_INFO.address}.`
  }
];

export function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const [formData, setFormData] = useState({
      name: "",
      phone: "+7",
      email: "",
      question: ""
    });
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Здесь будет API запрос
      console.log("Form submitted:", formData);
      // Пока просто логируем данные
    };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
            Отвечаем на ваши вопросы
          </h2>
          <p className="text-lg text-[#989898] max-w-2xl mx-auto">
            Самые частые вопросы наших клиентов и подробные ответы на них
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {faqData.map((item) => {
            const isOpen = openItems.includes(item.id);
            
            return (
              <div
                key={item.id}
                className="bg-white overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-300"
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full p-6 text-left flex items-start justify-between hover:bg-white transition-colors duration-200"
                >
                  <h3 className="text-lg font-semibold text-[#333333] pr-4 leading-relaxed">
                    {item.question}
                  </h3>
                  <div className="shrink-0 mt-1">
                    {isOpen ? (
                      <Minus className="h-6 w-6 text-[#333333]" />
                    ) : (
                      <Plus className="h-6 w-6 text-[#333333]" />
                    )}
                  </div>
                </button>
                
                {isOpen && (
                  <div className="px-6 pb-6">
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-[#989898] leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
          
        <div className='p-10 my-2 w-6xl mx-auto bg-white flex justify-between items-center border border-gray-200 hover:shadow-md transition-shadow duration-300 '>
          <span className='text-[#333333] text-lg '>ОСТАЛИСЬ ВОПРОСЫ? СВЯЖИТЕСЬ С НАМИ!</span>
         <Dialog>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="px-8 py-4 text-lg font-light bg-black hover:bg-black/50 text-white"
              >
                Задать вопрос
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-white">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-900 text-center mb-4">
                  Расчёт доставки и установки
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Имя */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2 ">
                    Имя
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-0 border-b text-gray-700  outline-none transition-colors"
                    placeholder="Введите ваше имя"
                  />
                </div>

                {/* Телефон */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-0 border-b text-gray-700  outline-none transition-colors"
                    placeholder="+7 (000) 000-00-00"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-0 border-b text-gray-700  outline-none transition-colors"
                    placeholder="example@email.com"
                  />
                </div>

                {/* Вопрос */}
                <div>
                  <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
                    Описание проекта (не обязательно)
                  </label>
                  <textarea
                    id="question"
                    name="question"
                    value={formData.question}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 focus:ring-2  outline-none transition-colors resize-none"
                    placeholder="Опишите ваш проект, площадь, адрес доставки"
                  />
                </div>

                {/* Кнопка отправки */}
                <Button 
                  type="submit" 
                  className="w-full py-3 text-sm font-semibold bg-black hover:bg-black/50 text-white"
                >
                  Получить расчёт
                </Button>

                {/* Политика конфиденциальности */}
                <p className="text-xs text-gray-500 text-center leading-relaxed">
                  Нажимая на кнопку "Получить расчёт", вы соглашаетесь с{" "}
                  <a href="/privacy" className="text-blue-600 hover:text-blue-700 underline">
                    политикой конфиденциальности
                  </a>
                </p>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
}