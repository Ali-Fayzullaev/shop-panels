"use client";

import React, { useState } from 'react';
import { Palette, Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";

// ⚙️ Цвета для выбора — можно расширять
const colorPalette = [
  { id: 'bamboo', name: 'Бамбук', color: '#D2B48C' },
  { id: 'wood-light', name: 'Светлое дерево', color: '#F5DEB3' },
  { id: 'wood-dark', name: 'Темное дерево', color: '#8B4513' },
  { id: 'stone', name: 'Камень', color: '#696969' },
  { id: 'emerald', name: 'Изумруд', color: '#006400' },
  { id: 'teal', name: 'Бирюза', color: '#008080' },
  { id: 'beige', name: 'Бежевый', color: '#F5F5DC' },
  { id: 'charcoal', name: 'Уголь', color: '#36454F' },
  { id: 'clay', name: 'Глина', color: '#B27A5E' },
  { id: 'sand', name: 'Песок', color: '#E6D5B8' },
];

export function VisualizerContent() {
  // 🔲 Состояния для каждой зоны
  const [colors, setColors] = useState({
    leftWall: colorPalette[0].color,
    centerPanel: colorPalette[1].color,
    rightWall: colorPalette[2].color,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🖼️ Путь к PNG дивана (прозрачный фон!)
  const sofaImageUrl = "/vez/img01.webp"; // ← ЗАМЕНИ НА PNG С ПРОЗРАЧНОСТЬЮ!

  return (
    <section className="relative min-h-screen bg-gray-50 overflow-hidden">
      {/* 🔥 ФОН РАЗДЕЛЁН НА ЗОНЫ */}
      <div className="absolute inset-0 flex">

        {/* 🟢 ЛЕВАЯ СТЕНА */}
        <div 
          className="flex-1"
          style={{
            backgroundColor: colors.leftWall,
            backgroundImage: `url('/vez/wall-texture.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'background-color 0.3s ease'
          }}
        />

        {/* 🟡 ЦЕНТРАЛЬНАЯ ПАНЕЛЬ (где диван) */}
        <div 
          className="w-[50%] md:w-[40%]"
          style={{
            backgroundColor: colors.centerPanel,
            backgroundImage: `url('/vez/wall-texture.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'background-color 0.3s ease'
          }}
        />

        {/* 🔵 ПРАВАЯ СТЕНА */}
        <div 
          className="flex-1"
          style={{
            backgroundColor: colors.rightWall,
            backgroundImage: `url('/vez/wall-texture.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'background-color 0.3s ease'
          }}
        />

      </div>

      {/* 💡 КНОПКА "НАСТРОИТЬ ЗОНЫ" */}
      <div className="absolute top-4 right-4 z-50">
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#333333] hover:bg-gray-700 text-white flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          Настроить зоны
        </Button>
      </div>

      {/* 🛋️ ДИВАН — ПО ЦЕНТРУ, АДАПТИВНЫЙ */}
      <div className="flex items-end justify-center h-screen ">
        <div className="relative max-w-full max-h-full">
          <img
            src={sofaImageUrl}
            alt="Диван"
            className="max-w-[100vw] object-contain"
            style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }}
          />
        </div>
      </div>

      {/* 🎨 МОДАЛЬНОЕ ОКНО С НАСТРОЙКАМИ ЗОН */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#333333]">Настройте зоны</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* 🟢 ЛЕВАЯ СТЕНА */}
            <div className="mb-6">
              <h4 className="font-medium text-[#333333] mb-3">Левая стена</h4>
              <div className="grid grid-cols-3 gap-3">
                {colorPalette.map((colorOption) => (
                  <div
                    key={`left-${colorOption.id}`}
                    onClick={() => setColors(prev => ({ ...prev, leftWall: colorOption.color }))}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      colors.leftWall === colorOption.color
                        ? 'border-[#333333] bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div
                      className="w-full h-12 rounded-md border"
                      style={{ backgroundColor: colorOption.color }}
                    ></div>
                    <p className="mt-2 text-xs text-center text-[#333333] truncate">
                      {colorOption.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 🟡 ЦЕНТРАЛЬНАЯ ПАНЕЛЬ */}
            <div className="mb-6">
              <h4 className="font-medium text-[#333333] mb-3">Центральная панель</h4>
              <div className="grid grid-cols-3 gap-3">
                {colorPalette.map((colorOption) => (
                  <div
                    key={`center-${colorOption.id}`}
                    onClick={() => setColors(prev => ({ ...prev, centerPanel: colorOption.color }))}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      colors.centerPanel === colorOption.color
                        ? 'border-[#333333] bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div
                      className="w-full h-12 rounded-md border"
                      style={{ backgroundColor: colorOption.color }}
                    ></div>
                    <p className="mt-2 text-xs text-center text-[#333333] truncate">
                      {colorOption.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 🔵 ПРАВАЯ СТЕНА */}
            <div className="mb-6">
              <h4 className="font-medium text-[#333333] mb-3">Правая стена</h4>
              <div className="grid grid-cols-3 gap-3">
                {colorPalette.map((colorOption) => (
                  <div
                    key={`right-${colorOption.id}`}
                    onClick={() => setColors(prev => ({ ...prev, rightWall: colorOption.color }))}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      colors.rightWall === colorOption.color
                        ? 'border-[#333333] bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div
                      className="w-full h-12 rounded-md border"
                      style={{ backgroundColor: colorOption.color }}
                    ></div>
                    <p className="mt-2 text-xs text-center text-[#333333] truncate">
                      {colorOption.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 💡 КНОПКА СБРОСА */}
            <div className="pt-4 border-t">
              <Button
                variant="outline"
                className="w-full text-[#333333] border-[#333333] hover:bg-[#333333] hover:text-white"
                onClick={() => setColors({
                  leftWall: colorPalette[0].color,
                  centerPanel: colorPalette[1].color,
                  rightWall: colorPalette[2].color,
                })}
              >
                Сбросить
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}