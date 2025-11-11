"use client";

import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";

// Типы для зон
type ZoneType = 'leftWall' | 'centerPanel' | 'rightWall';

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
  const [pictures, setPictures] = useState({
    leftWall: picturePalette[0].src,
    centerPanel: picturePalette[1].src,
    rightWall: picturePalette[2].src,
  });

  const [leftModalOpen, setLeftModalOpen] = useState(false);
  const [centerModalOpen, setCenterModalOpen] = useState(false);
  const [rightModalOpen, setRightModalOpen] = useState(false);

  const sofaImageUrl = "/vez/img01.webp";

  // Универсальный обработчик выбора
  const handleSelectPicture = (zone: ZoneType, src: string) => {
    setPictures(prev => ({ ...prev, [zone]: src }));
  };

  // Универсальная модалка
  const PictureModal = ({ isOpen, onClose, zone, currentSrc }: {
    isOpen: boolean;
    onClose: () => void;
    zone: ZoneType;
    currentSrc: string;
  }) => {
    if (!isOpen) return null;

    const zoneNames: Record<ZoneType, string> = {
      leftWall: 'Левая стена',
      centerPanel: 'Центральная панель',
      rightWall: 'Правая стена',
    };

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white shadow-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-[#333333]">{zoneNames[zone]}</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {picturePalette.map((pic) => (
              <div
                key={`modal-${pic.id}`}
                onClick={() => {
                  handleSelectPicture(zone, pic.src);
                  onClose();
                }}
                className={`p-2 border-2 cursor-pointer transition-all ${
                  currentSrc === pic.src
                    ? 'border-[#333333] bg-gray-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="w-full h-12 overflow-hidden border">
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

          <div className="pt-4 border-t">
            <Button
              variant="outline"
              className="w-full text-[#333333] border-[#333333] hover:bg-[#333333] hover:text-white"
              onClick={() => {
                // Сбросить на первую картину
                const defaultSrc = picturePalette[0].src;
                handleSelectPicture(zone, defaultSrc);
                onClose();
              }}
            >
              Сбросить
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="relative h-[50vh] lg:min-h-screen bg-gray-50 overflow-hidden">
      {/* 🔥 ФОН РАЗДЕЛЁН НА ЗОНЫ */}
      <div className="absolute inset-0 flex">

        {/* 🟢 ЛЕВАЯ СТЕНА */}
        <div className="flex-1 relative">
          <div
            style={{
              backgroundImage: `url('${pictures.leftWall}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              width: '100%',
              height: '100%',
            }}
          />
          {/* Иконка для левой стены */}
          <button
            onClick={() => setLeftModalOpen(true)}
            className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
            title="Выбрать картину для левой стены"
          >
            <ImageIcon className="h-5 w-5 text-[#333333]" />
          </button>
        </div>

        {/* 🟡 ЦЕНТРАЛЬНАЯ ПАНЕЛЬ */}
        <div className="w-[50%] md:w-[40%] relative">
          <div
            style={{
              backgroundImage: `url('${pictures.centerPanel}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              width: '100%',
              height: '100%',
            }}
          />
          {/* Иконка для центра */}
          <button
            onClick={() => setCenterModalOpen(true)}
            className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
            title="Выбрать картину для центральной панели"
          >
            <ImageIcon className="h-5 w-5 text-[#333333]" />
          </button>
        </div>

        {/* 🔵 ПРАВАЯ СТЕНА */}
        <div className="flex-1 relative">
          <div
            style={{
              backgroundImage: `url('${pictures.rightWall}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              width: '100%',
              height: '100%',
            }}
          />
          {/* Иконка для правой стены */}
          <button
            onClick={() => setRightModalOpen(true)}
            className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
            title="Выбрать картину для правой стены"
          >
            <ImageIcon className="h-5 w-5 text-[#333333]" />
          </button>
        </div>

      </div>

      {/* 🛋️ ДИВАН */}
      <div className="flex items-end justify-center h-[50vh] lg:h-screen">
        <div className="relative max-w-full max-h-full">
          <img
            src={sofaImageUrl}
            alt="Диван"
            className="max-w-[100vw] object-contain"
            style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }}
          />
        </div>
      </div>

      {/* ✨ МОДАЛКИ */}
      <PictureModal
        isOpen={leftModalOpen}
        onClose={() => setLeftModalOpen(false)}
        zone="leftWall"
        currentSrc={pictures.leftWall}
      />
      <PictureModal
        isOpen={centerModalOpen}
        onClose={() => setCenterModalOpen(false)}
        zone="centerPanel"
        currentSrc={pictures.centerPanel}
      />
      <PictureModal
        isOpen={rightModalOpen}
        onClose={() => setRightModalOpen(false)}
        zone="rightWall"
        currentSrc={pictures.rightWall}
      />
    </section>
  );
}