'use client';

import React, { useEffect, useState, useRef } from 'react';
import BookViewer from '@/components/BookViewer';
import BookControls from '@/components/BookControls';
import { PDFLoader } from '@/lib/pdfLoader';

export default function BookPage() {
  const [pages, setPages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Инициализация
  useEffect(() => {
    audioRef.current = new Audio('/sounds/flip.mp3'); // Убедитесь, что файл существует или уберите
    
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 2. Умное скрытие контролов
  useEffect(() => {
    const show = () => {
      setShowControls(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    };

    window.addEventListener('mousemove', show);
    window.addEventListener('touchstart', show);
    window.addEventListener('click', show);
    show();

    return () => {
      window.removeEventListener('mousemove', show);
      window.removeEventListener('touchstart', show);
      window.removeEventListener('click', show);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // 3. Загрузка страниц
  useEffect(() => {
    // Имитация или реальная загрузка
    const load = async () => {
       try {
        // Попробуйте загрузить PDF, если нет - демо
        const pdfPages = await PDFLoader.loadPDFWithProgress(
          '/FlipbookViewer.pdf',
          (loaded, total) => setProgress((loaded / total) * 100),
          { scale: 2.5 }
        );
        setPages(pdfPages);
       } catch (e) {
         // ДЕМО КОНТЕНТ (если PDF нет)
         // Создаем красивые SVG плейсхолдеры
         const demo = Array.from({ length: 10 }, (_, i) => 
            `https://placehold.co/600x850/fcfcfc/333?text=Страница+${i+1}&font=playfair-display`
         );
         setPages(demo);
       }
       setLoading(false);
    };
    load();
  }, []);

  const handlePageChange = (idx: number) => {
    setCurrentPage(idx);
    if (audioRef.current) {
        audioRef.current.currentTime = 0;
        // Тихий звук перелистывания
        audioRef.current.volume = 0.2;
        audioRef.current.play().catch(() => {});
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-neutral-900 text-white">
        <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"/>
        <p className="text-sm font-medium text-white/60">Подготовка книги... {Math.round(progress)}%</p>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#1a1a1a]">
        {/* Текстурированный фон (Деревянный стол или темный градиент) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-800 via-neutral-900 to-black" />
        
        {/* Основной контейнер книги */}
        <div className="relative z-10 h-full w-full flex flex-col items-center justify-center">
            <BookViewer 
                pages={pages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
            />
        </div>

        {/* Контролы */}
        <BookControls
            currentPage={currentPage}
            totalPages={pages.length}
            soundEnabled={!!audioRef.current}
            isFullscreen={isFullscreen}
            showControls={showControls}
            isMobile={isMobile}
            onPrevPage={() => setCurrentPage(p => Math.max(0, p - 1))}
            onNextPage={() => setCurrentPage(p => Math.min(pages.length - 1, p + 1))}
            onToggleSound={() => { /* Логика звука */ }}
            onToggleFullscreen={() => {
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen();
                    setIsFullscreen(true);
                } else {
                    document.exitFullscreen();
                    setIsFullscreen(false);
                }
            }}
        />
    </div>
  );
}