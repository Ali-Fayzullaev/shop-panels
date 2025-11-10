"use client";

import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/data/types";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { state, removeFromCart, updateQuantity, clearCart } = useCart();

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
              <Button size="lg" className="bg-black hover:bg-gray-800">
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
                  className="bg-white rounded-lg shadow-sm border p-6"
                >
                  <div className="flex items-start space-x-4">
                    {/* Изображение товара */}
                    <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0">
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
                          onClick={() => removeFromCart(item.product.id)}
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
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
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
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
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
              <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-4">
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

                <Button size="lg" className="w-full bg-black hover:bg-gray-800 mb-4">
                  Оформить заказ
                </Button>

                <Link href="/catalog">
                  <Button variant="outline" size="lg" className="w-full">
                    Продолжить покупки
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}