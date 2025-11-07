"use client";

import React, { useState } from 'react';
import { Palette, Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";

// 🖼️ ПАЛИТРА КАРТИН — 12 штук
const picturePalette = [
  { id: 'wall01', name: 'Картина 1', src: '/wall/wall01.png' },
  { id: 'wall02', name: 'Картина 2', src: '/wall/wall02.png' },
  { id: 'wall03', name: 'Картина 3', src: '/wall/wall03.png' },
  { id: 'wall04', name: 'Картина 4', src: '/wall/wall04.png' },
  { id: 'wall05', name: 'Картина 5', src: '/wall/wall05.png' },
  { id: 'wall06', name: 'Картина 6', src: '/wall/wall06.png' },
  { id: 'wall07', name: 'Картина 7', src: '/wall/wall07.png' },
  { id: 'wall08', name: 'Картина 8', src: '/wall/wall08.png' },
  { id: 'wall09', name: 'Картина 9', src: '/wall/wall09.jpg' },
  { id: 'wall10', name: 'Картина 10', src: '/wall/wall10.png' },
  { id: 'wall11', name: 'Картина 11', src: '/wall/wall11.png' },
  { id: 'wall12', name: 'Картина 12', src: '/wall/wall12.png' },
];

export function VisualizerContent() {
  // 🔲 Состояния для каждой зоны — теперь хранят ID картины
  const [pictures, setPictures] = useState({
    leftWall: picturePalette[0].src,
    centerPanel: picturePalette[1].src,
    rightWall: picturePalette[2].src,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🖼️ Путь к PNG дивана (прозрачный фон!)
  const sofaImageUrl = "/vez/img01.webp"; // ← ЗАМЕНИ НА PNG С ПРОЗРАЧНОСТЬЮ!

  return (
    <section className="relative h-[50vh] lg:min-h-screen bg-gray-50 overflow-hidden">
      {/* 🔥 ФОН РАЗДЕЛЁН НА ЗОНЫ — ТЕПЕРЬ С КАРТИНАМИ */}
      <div className="absolute inset-0 flex">

        {/* 🟢 ЛЕВАЯ СТЕНА */}
        <div 
          className="flex-1"
          style={{
            backgroundImage: `url('${pictures.leftWall}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'background-image 0.3s ease'
          }}
        />

        {/* 🟡 ЦЕНТРАЛЬНАЯ ПАНЕЛЬ (где диван) */}
        <div 
          className="w-[50%] md:w-[40%]"
          style={{
            backgroundImage: `url('${pictures.centerPanel}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'background-image 0.3s ease'
          }}
        />

        {/* 🔵 ПРАВАЯ СТЕНА */}
        <div 
          className="flex-1"
          style={{
            backgroundImage: `url('${pictures.rightWall}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'background-image 0.3s ease'
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
      <div className="flex items-end justify-center h-[50vh] lg:h-screen">
        <div className="relative max-w-full max-h-full">
          <img
            src={sofaImageUrl}
            alt="Диван"
            className="max-w-[100vw] object-contain"
            style={{ filter: 'drop-shadow(0 0px 0px rgba(0,0,0,0.1))' }}
          />
        </div>
      </div>

      {/* 🎨 МОДАЛЬНОЕ ОКНО С ВЫБОРОМ КАРТИН */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#333333]">Выберите картину</h3>
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
                {picturePalette.map((pic) => (
                  <div
                    key={`left-${pic.id}`}
                    onClick={() => setPictures(prev => ({ ...prev, leftWall: pic.src }))}
                    className={`p-2 rounded-lg border-2 cursor-pointer transition-all ${
                      pictures.leftWall === pic.src
                        ? 'border-[#333333] bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-full h-12 rounded-md overflow-hidden border">
                      <img
                        src={pic.src}
                        alt={pic.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="mt-1 text-xs text-center text-[#333333] truncate">
                      {pic.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 🟡 ЦЕНТРАЛЬНАЯ ПАНЕЛЬ */}
            <div className="mb-6">
              <h4 className="font-medium text-[#333333] mb-3">Центральная панель</h4>
              <div className="grid grid-cols-3 gap-3">
                {picturePalette.map((pic) => (
                  <div
                    key={`center-${pic.id}`}
                    onClick={() => setPictures(prev => ({ ...prev, centerPanel: pic.src }))}
                    className={`p-2 rounded-lg border-2 cursor-pointer transition-all ${
                      pictures.centerPanel === pic.src
                        ? 'border-[#333333] bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-full h-12 rounded-md overflow-hidden border">
                      <img
                        src={pic.src}
                        alt={pic.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="mt-1 text-xs text-center text-[#333333] truncate">
                      {pic.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 🔵 ПРАВАЯ СТЕНА */}
            <div className="mb-6">
              <h4 className="font-medium text-[#333333] mb-3">Правая стена</h4>
              <div className="grid grid-cols-3 gap-3">
                {picturePalette.map((pic) => (
                  <div
                    key={`right-${pic.id}`}
                    onClick={() => setPictures(prev => ({ ...prev, rightWall: pic.src }))}
                    className={`p-2 rounded-lg border-2 cursor-pointer transition-all ${
                      pictures.rightWall === pic.src
                        ? 'border-[#333333] bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-full h-12 rounded-md overflow-hidden border">
                      <img
                        src={pic.src}
                        alt={pic.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="mt-1 text-xs text-center text-[#333333] truncate">
                      {pic.name}
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
                onClick={() => setPictures({
                  leftWall: picturePalette[0].src,
                  centerPanel: picturePalette[1].src,
                  rightWall: picturePalette[2].src,
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