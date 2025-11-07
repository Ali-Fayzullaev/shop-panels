"use client";

import React, { useState } from 'react';
import { Home, Palette } from 'lucide-react';
import { Button } from "@/components/ui/button";

const rooms = [
  { id: 'living', name: 'Гостиная', image: '/vez/img01.webp' },
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

  // ⬇️ Здесь будет твоя PNG картинка дивана (с прозрачным фоном)
  const sofaImageUrl = "/vez/img01.webp"; // ← ЗАМЕНИ ЭТО НА ТВОЙ РЕАЛЬНЫЙ ПУТЬ

  return (
    <section className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        
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
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* 🔥 ОСНОВНАЯ ЧАСТЬ — ФОН + ДИВАН */}
              <div className="relative aspect-video bg-gray-100">
                
                {/* ФОН — стена, которую можно менять */}
                <div 
                  className="absolute inset-0"
                  style={{ 
                    backgroundColor: selectedMaterial.color,
                    backgroundImage: `url('/vez/wall-texture.jpg')`, // ← можно добавить текстуру, если есть
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />

                {/* ДИВАН — поверх фона */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <img 
                    src={sofaImageUrl} 
                    alt="Диван" 
                    className="max-w-full max-h-full object-contain"
                    style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }}
                  />
                </div>
              </div>
            </div>

         
          </div>
        </div>
      </div>
    </section>
  );
}