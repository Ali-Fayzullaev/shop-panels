"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/data/types";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ShoppingBag, CheckCircle, AlertCircle } from "lucide-react";
import { useOrder } from "@/hooks/useOrder";

export default function CartPage() {
  const { state, removeFromCart, updateQuantity, clearCart } = useCart();
  const { isLoading, isSuccess, error, sendOrder, resetState } = useOrder();
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [showContactForm, setShowContactForm] = useState(false);

  const handleOrderSubmit = async () => {
    await sendOrder(state.items, state.total, customerInfo);
  };

  // Эффект для очистки корзины после успешной отправки
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        clearCart();
        setCustomerInfo({ name: '', phone: '', email: '' });
        setShowContactForm(false);
        resetState();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isSuccess, clearCart, resetState]);

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <ShoppingBag className="mx-auto h-24 w-24 text-gray-400 mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Ваша корзина пуста</h1>
            <p className="text-gray-600 mb-8">
              Добавьте товары в корзину, чтобы оформить заказ
            </p>
            <Link href="/catalog">
              <Button size="lg" className="bg-black hover:bg-gray-800 text-white">
                Перейти к каталогу
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Заголовок */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Корзина</h1>
            <Button
              variant="outline"
              onClick={clearCart}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Очистить корзину
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Список товаров */}
            <div className="lg:col-span-2 space-y-6">
              {state.items.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedThickness}`}
                  className="bg-white shadow-sm border p-6"
                >
                  <div className="flex items-start space-x-4">
                    {/* Изображение товара */}
                    <div className="relative w-24 h-24 bg-gray-100 overflow-hidden shrink-0">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Информация о товаре */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {item.product.name}
                          </h3>
                          <p className="text-sm text-gray-500 mb-2">
                            SKU: {item.product.sku}
                          </p>
                          {item.selectedThickness && (
                            <p className="text-sm text-blue-600 mb-2">
                              Толщина: {item.selectedThickness}
                            </p>
                          )}
                          <p className="text-lg font-bold text-gray-900">
                            {formatPrice(item.product.price, item.product.currency)}
                          </p>
                        </div>

                        {/* Кнопка удаления */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.product.id, item.selectedThickness)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Количество */}
                      <div className="flex items-center space-x-3 mt-4">
                        <span className="text-sm text-gray-600">Количество:</span>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedThickness)}
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 p-0"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedThickness)}
                            className="w-8 h-8 p-0"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Подытог */}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t">
                        <span className="text-sm text-gray-600">Подытог:</span>
                        <span className="font-bold text-lg">
                          {formatPrice(item.product.price * item.quantity, item.product.currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Итого и оформление */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow-sm border p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Итого</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Товары ({state.items.reduce((acc, item) => acc + item.quantity, 0)} шт):</span>
                    <span>{formatPrice(state.total, "₸")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Доставка:</span>
                    <span className="text-green-600">Бесплатно</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">К оплате:</span>
                      <span className="text-2xl font-bold text-gray-900">
                        {formatPrice(state.total, "₸")}
                      </span>
                    </div>
                  </div>
                </div>

                {isSuccess ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-2 bg-green-50 border border-green-200 rounded-lg p-4">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-green-700 font-medium">Заказ успешно отправлен!</span>
                    </div>
                    <p className="text-sm text-gray-600 text-center">
                      Мы свяжемся с вами в ближайшее время для подтверждения заказа.
                    </p>
                  </div>
                ) : (
                  <>
                    {showContactForm ? (
                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900">Контактная информация</h3>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Имя
                            </label>
                            <input
                              type="text"
                              value={customerInfo.name}
                              onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                              placeholder="Ваше имя"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Телефон *
                            </label>
                            <input
                              type="tel"
                              value={customerInfo.phone}
                              onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                              placeholder="+7 (___) ___-__-__"
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Email
                            </label>
                            <input
                              type="email"
                              value={customerInfo.email}
                              onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                              placeholder="your@email.com"
                            />
                          </div>
                        </div>

                        {error && (
                          <div className="flex items-center space-x-2 bg-red-50 border border-red-200 rounded-lg p-3">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            <span className="text-red-700 text-sm">{error}</span>
                          </div>
                        )}

                        <div className="flex space-x-3">
                          <Button
                            variant="outline"
                            size="lg"
                            className="flex-1"
                            onClick={() => {
                              setShowContactForm(false);
                              resetState();
                            }}
                          >
                            Назад
                          </Button>
                          <Button
                            size="lg"
                            className="flex-1 bg-black hover:bg-gray-800 text-white"
                            onClick={handleOrderSubmit}
                            disabled={isLoading || !customerInfo.phone.trim()}
                          >
                            {isLoading ? 'Отправляем...' : 'Отправить заказ'}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        size="lg"
                        className="w-full bg-black hover:bg-gray-800 mb-4 text-white"
                        onClick={() => setShowContactForm(true)}
                      >
                        Оформить заказ
                      </Button>
                    )}
                  </>
                )}

                {!isSuccess && (
                  <Link href="/catalog">
                    <Button variant="outline" size="lg" className="w-full mt-4">
                      Продолжить покупки
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}