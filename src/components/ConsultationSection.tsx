"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ConsultationSection() {
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
    <section className="py-16 bg-[#333333]">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Оставьте заявку и получите бесплатную консультацию
          </h2>
          <p className="text-lg text-gray-400 mb-8">
            Мы перезвоним в течение 15 минут, ответим на все вопросы и сделаем вам выгодное предложение
          </p>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="px-8 py-4 text-lg font-semibold bg-white hover:bg-white/50 text-[#333333]"
              >
                Оставить заявку
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-white">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-900 text-center mb-4">
                  Получите бесплатную консультацию
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
                    Вопрос (не обязательно)
                  </label>
                  <textarea
                    id="question"
                    name="question"
                    value={formData.question}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 focus:ring-2  outline-none transition-colors resize-none"
                    placeholder="Опишите ваш вопрос или пожелания"
                  />
                </div>

                {/* Кнопка отправки */}
                <Button 
                  type="submit" 
                  className="w-full py-3 text-sm font-semibold bg-black hover:bg-black/50 text-white"
                >
                  Оставить заявку
                </Button>

                {/* Политика конфиденциальности */}
                <p className="text-xs text-gray-500 text-center leading-relaxed">
                  Нажимая на кнопку "Оставить заявку", вы соглашаетесь с{" "}
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