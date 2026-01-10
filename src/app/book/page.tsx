'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { PageFlip } from 'page-flip';
import { PDFLoader } from '@/lib/pdfLoader';
import { ChevronLeft, ChevronRight, Grid, Maximize, X, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BookPage() {
  const [pages, setPages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0); // Прогресс загрузки
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<PageFlip | null>(null);
  const router = useRouter();

  // Скрываем Header/Footer и определяем мобильное устройство
  useEffect(() => {
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    
    if (header) header.style.display = 'none';
    if (footer) footer.style.display = 'none';
    
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      if (header) header.style.display = '';
      if (footer) footer.style.display = '';
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Загрузка PDF с прогрессом
  useEffect(() => {
    const loadPDF = async () => {
      try {
        const loadedPages = await PDFLoader.loadPDFWithProgress(
          '/FlipbookViewer.pdf',
          (loaded, total) => {
            const percent = Math.round((loaded / total) * 100);
            setProgress(percent);
          },
          { scale: 2.0 }
        );
        if (loadedPages && loadedPages.length > 0) {
          setPages(loadedPages);
        }
      } catch (error) {
        console.error('Ошибка загрузки PDF:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPDF();
  }, []);

  // Инициализация PageFlip после загрузки страниц
  useEffect(() => {
    if (loading || pages.length === 0 || !containerRef.current) return;

    // Очищаем контейнер
    containerRef.current.innerHTML = '';

    // Рассчитываем размеры
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const padding = isMobile ? 40 : 100;
    
    const availableWidth = screenWidth - padding;
    const availableHeight = screenHeight - padding;
    
    // Пропорции A4
    const pageRatio = 0.707;
    const spreadRatio = isMobile ? pageRatio : pageRatio * 2;
    
    let bookWidth: number;
    let bookHeight: number;
    
    if (availableWidth / availableHeight > spreadRatio) {
      bookHeight = Math.min(availableHeight, isMobile ? 600 : 650);
      bookWidth = bookHeight * spreadRatio;
    } else {
      bookWidth = Math.min(availableWidth, isMobile ? 400 : 900);
      bookHeight = bookWidth / spreadRatio;
    }

    const pageWidth = isMobile ? bookWidth : bookWidth / 2;
    const pageHeight = bookHeight;

    // Создаём элемент книги
    const bookElement = document.createElement('div');
    containerRef.current.appendChild(bookElement);

    // Создаём страницы
    pages.forEach((src) => {
      const pageDiv = document.createElement('div');
      pageDiv.className = 'page';
      pageDiv.style.cssText = `
        background: #fdfbf7;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      `;
      
      const img = document.createElement('img');
      img.src = src;
      img.draggable = false;
      img.style.cssText = 'width: 100%; height: 100%; object-fit: contain;';
      
      pageDiv.appendChild(img);
      bookElement.appendChild(pageDiv);
    });

    // Инициализируем PageFlip
    const pageFlip = new PageFlip(bookElement, {
      width: pageWidth,
      height: pageHeight,
      showCover: true,
      usePortrait: isMobile,
      mobileScrollSupport: true,
      maxShadowOpacity: 0.3,
      flippingTime: 600,
    });

    pageFlip.loadFromHTML(bookElement.querySelectorAll('.page'));
    pageFlip.on('flip', (e) => setCurrentPage(e.data as number));

    bookRef.current = pageFlip;

    return () => {
      if (bookRef.current) {
        bookRef.current.destroy();
        bookRef.current = null;
      }
    };
  }, [loading, pages, isMobile]);

  // Навигация
  const goToPrev = useCallback(() => {
    if (bookRef.current && currentPage > 0) {
      bookRef.current.flipPrev();
    }
  }, [currentPage]);

  const goToNext = useCallback(() => {
    if (bookRef.current && currentPage < pages.length - 1) {
      bookRef.current.flipNext();
    }
  }, [currentPage, pages.length]);

  const goToPage = useCallback((index: number) => {
    if (bookRef.current) {
      bookRef.current.flip(index);
      setIsGalleryOpen(false);
    }
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (e) {
      console.log('Fullscreen error:', e);
    }
  }, []);

  // Клавиатура
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'Escape') setIsGalleryOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goToPrev, goToNext]);

  // Загрузка
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-900">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-white/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p>Загрузка каталога... {progress}%</p> {/* Отображение прогресса */}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-slate-900 flex flex-col">
      {/* Кнопка назад */}
      <button
        onClick={() => router.back()}
        className="absolute top-4 left-4 z-20 flex items-center gap-2 px-4 py-2 bg-black/70 backdrop-blur text-white rounded-full hover:bg-black/90 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="hidden sm:inline">Назад</span>
      </button>

      {/* Книга */}
      <div className="flex-1 flex items-center justify-center">
        <div 
          ref={containerRef}
          style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))' }}
        />
      </div>

      {/* Контролы */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/70 backdrop-blur px-6 py-3 rounded-full">
        <button
          onClick={goToPrev}
          disabled={currentPage === 0}
          className="p-2 text-white hover:bg-white/20 rounded-full disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <span className="text-white text-sm min-w-20 text-center">
          {currentPage + 1} / {pages.length}
        </span>

        <button
          onClick={goToNext}
          disabled={currentPage >= pages.length - 1}
          className="p-2 text-white hover:bg-white/20 rounded-full disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div className="w-px h-6 bg-white/30" />

        <button
          onClick={() => setIsGalleryOpen(true)}
          className="p-2 text-white hover:bg-white/20 rounded-full"
          title="Галерея"
        >
          <Grid className="w-5 h-5" />
        </button>

        <button
          onClick={toggleFullscreen}
          className="p-2 text-white hover:bg-white/20 rounded-full"
          title="Полный экран"
        >
          <Maximize className="w-5 h-5" />
        </button>
      </div>

      {/* Галерея */}
      {isGalleryOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 overflow-auto">
          <div className="sticky top-0 bg-black/80 backdrop-blur p-4 flex justify-between items-center border-b border-white/10">
            <h2 className="text-white text-xl font-bold">Страницы ({pages.length})</h2>
            <button
              onClick={() => setIsGalleryOpen(false)}
              className="p-2 text-white hover:bg-white/20 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {pages.map((page, index) => (
              <div
                key={index}
                onClick={() => goToPage(index)}
                className={`cursor-pointer rounded overflow-hidden border-2 transition-all hover:scale-105 ${
                  currentPage === index ? 'border-blue-500' : 'border-transparent'
                }`}
              >
                <img src={page} alt={`Страница ${index + 1}`} className="w-full bg-white" />
                <div className="bg-black/80 text-white text-center py-1 text-sm">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}