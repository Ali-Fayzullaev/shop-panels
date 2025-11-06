"use client";

import React, { useState } from 'react';
import { Home, Palette } from 'lucide-react';
import { Button } from "@/components/ui/button";

const rooms = [
  { id: 'living', name: 'Гостиная', image: '/vez/img01.webp' },
  { id: 'bedroom', name: 'Спальня', image: '/vez/img01.webp' },
  { id: 'kitchen', name: 'Кухня', image: '/vez/img01.webp' }
];

const materials = [
  { id: 'bamboo', name: 'Бамбук', color: '#D2B48C' },
  { id: 'wood-light', name: 'Светлое дерево', color: '#F5DEB3' },
  { id: 'wood-dark', name: 'Темное дерево', color: '#8B4513' },
  { id: 'stone', name: 'Камень', color: '#696969' }
];

export function VisualizerContent() {
  const [selectedRoom, setSelectedRoom] = useState(rooms[0]);
  const [selectedMaterial, setSelectedMaterial] = useState(materials[0]);

  return (
    <section className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#333333] mb-4">
            Интерактивный визуализатор
          </h1>
          <p className="text-lg text-[#989898] max-w-2xl mx-auto">
            Выберите комнату и материал панелей для просмотра в интерьере
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          <div className="lg:col-span-1 bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <Palette className="h-5 w-5 text-[#333333]" />
              <h3 className="text-xl font-bold text-[#333333]">Материалы</h3>
            </div>

            <div className="space-y-4">
              {materials.map((material) => (
                <div
                  key={material.id}
                  onClick={() => setSelectedMaterial(material)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedMaterial.id === material.id
                      ? 'border-[#333333] bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-lg border"
                      style={{ backgroundColor: material.color }}
                    ></div>
                    <div>
                      <h4 className="font-medium text-[#333333]">
                        {material.name}
                      </h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Home className="h-5 w-5 text-[#333333]" />
                <h3 className="text-xl font-bold text-[#333333]">Комнаты</h3>
              </div>

              <div className="flex gap-2 justify-center">
                {rooms.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => setSelectedRoom(room)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      selectedRoom.id === room.id
                        ? 'bg-[#333333] text-white'
                        : 'bg-gray-100 text-[#333333] hover:bg-gray-200'
                    }`}
                  >
                    {room.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              
              <div className="p-4 bg-gray-50 border-b">
                <h4 className="font-medium text-[#333333]">
                  {selectedRoom.name} • {selectedMaterial.name}
                </h4>
              </div>

              <div className="relative aspect-video bg-gray-100">
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ 
                    backgroundImage: `url('${selectedRoom.image}')`,
                    filter: 'brightness(0.9)'
                  }}
                />

                <div className="absolute inset-0">
                  <div 
                    className="absolute top-1/4 left-1/4 w-1/3 h-1/3 rounded-lg opacity-70 transition-colors duration-500"
                    style={{ backgroundColor: selectedMaterial.color }}
                  />
                  <div 
                    className="absolute top-1/3 right-1/4 w-1/4 h-1/4 rounded-lg opacity-70 transition-colors duration-500"
                    style={{ backgroundColor: selectedMaterial.color }}
                  />
                </div>

                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-sm text-[#333333]">
                    <strong>{selectedMaterial.name}</strong> в интерьере {selectedRoom.name.toLowerCase()}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-white rounded-lg shadow-lg p-6 text-center">
              <h4 className="text-xl font-bold text-[#333333] mb-4">
                Понравился результат?
              </h4>
              <p className="text-[#989898] mb-6">
                Закажите бесплатную консультацию дизайнера
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-[#333333] hover:bg-gray-700 text-white">
                  Заказать консультацию
                </Button>
                <Button variant="outline" className="text-[#333333] border-[#333333] hover:bg-[#333333] hover:text-white">
                  Скачать каталог
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
