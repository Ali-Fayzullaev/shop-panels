'use client';

import React, { useEffect, useState } from 'react';
import BookViewer from '@/components/BookViewer';
import BookControls from '@/components/BookControls';
import { useBookState } from '@/hooks/useBookState';
import { PDFLoader } from '@/lib/pdfLoader';
import { BookSounds } from '@/lib/bookSounds';

export default function BookPage() {
  const [pages, setPages] = useState<string[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('Инициализация...');
  const [bookState, bookActions] = useBookState(pages);
  const [soundsReady, setSoundsReady] = useState(false);
  const [isBookReady, setIsBookReady] = useState(false);
  
  // Загрузка PDF и звуков
  useEffect(() => {
    const loadBookContent = async () => {
      try {
        setLoadingMessage('Загрузка звуков...');
        
        // Загружаем звуки
        const sounds = BookSounds.getInstance();
        await sounds.loadBookSounds();
        setSoundsReady(true);
        
        setLoadingMessage('Загрузка PDF...');
        setLoadingProgress(10);
        
        // Загружаем PDF
        const pdfPages = await PDFLoader.loadPDFWithProgress(
          '/FlipbookViewer.pdf',
          (loaded, total) => {
            const progress = 10 + (loaded / total) * 80; // 10% звуки, 80% PDF
            setLoadingProgress(progress);
            setLoadingMessage(`Конвертация страниц: ${loaded}/${total}`);
          },
          {
            scale: 2.5, // Увеличенное качество
            quality: 0.95
          }
        );
        
        setLoadingMessage('Подготовка книги к отображению...');
        setLoadingProgress(95);
        
        console.log('PDF успешно конвертирован в', pdfPages.length, 'страниц');
        
        // Задержка для корректного рендеринга
        console.log('🚀 PDF загружен, устанавливаем страницы:', pdfPages.length);
        setPages(pdfPages);
        setLoadingMessage('Книга готова!');
        setLoadingProgress(100);
        setIsBookReady(true);
        
      } catch (error) {
        console.error('Ошибка загрузки PDF:', error);
        setLoadingMessage('Ошибка загрузки PDF, используем демо...');
        
        // Fallback: создаем красивые демонстрационные страницы
        const demoPages = Array.from({ length: 12 }, (_, i) => 
          `data:image/svg+xml;base64,${btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
              <defs>
                <linearGradient id="bgGrad${i}" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#f8fafc;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#e2e8f0;stop-opacity:1" />
                </linearGradient>
                <linearGradient id="titleGrad${i}" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
                </linearGradient>
              </defs>
              
              <rect width="400" height="600" fill="url(#bgGrad${i})"/>
              
              <!-- Заголовок -->
              <text x="200" y="80" text-anchor="middle" font-family="serif" font-size="28" font-weight="bold" fill="url(#titleGrad${i})">
                Каталог Панелей
              </text>
              
              <!-- Подзаголовок -->
              <text x="200" y="120" text-anchor="middle" font-family="sans-serif" font-size="16" fill="#64748b">
                Страница ${i + 1}
              </text>
              
              <!-- Декоративные линии -->
              <line x1="50" y1="140" x2="350" y2="140" stroke="#cbd5e1" stroke-width="2"/>
              <line x1="50" y1="145" x2="350" y2="145" stroke="#e2e8f0" stroke-width="1"/>
              
              <!-- Имитация контента -->
              <rect x="50" y="180" width="300" height="3" fill="#e2e8f0" rx="1"/>
              <rect x="50" y="200" width="250" height="3" fill="#e2e8f0" rx="1"/>
              <rect x="50" y="220" width="280" height="3" fill="#e2e8f0" rx="1"/>
              <rect x="50" y="240" width="200" height="3" fill="#e2e8f0" rx="1"/>
              
              <!-- Центральная иллюстрация -->
              <circle cx="200" cy="350" r="60" fill="none" stroke="#6366f1" stroke-width="3" opacity="0.3"/>
              <circle cx="200" cy="350" r="45" fill="none" stroke="#8b5cf6" stroke-width="2" opacity="0.5"/>
              <circle cx="200" cy="350" r="30" fill="#6366f1" opacity="0.1"/>
              
              <!-- Номер страницы -->
              <circle cx="200" cy="520" r="25" fill="#6366f1"/>
              <text x="200" y="528" text-anchor="middle" font-family="sans-serif" font-size="18" font-weight="bold" fill="white">
                ${i + 1}
              </text>
              
              <!-- Нижняя декоративная линия -->
              <line x1="50" y1="560" x2="350" y2="560" stroke="#cbd5e1" stroke-width="1"/>
            </svg>
          `)}`
        );
        console.log('🎭 Используем демо страницы:', demoPages.length);
        setPages(demoPages);
        setLoadingProgress(100);
        setIsBookReady(true);
      }
    };

    loadBookContent();
  }, []);

  const handlePageChange = (page: number) => {
    console.log('Текущая страница:', page + 1);
    
    // Обновляем состояние книги
    bookActions.goToPage(page);
    
    // Воспроизводим звук перелистывания
    if (soundsReady && bookState.soundEnabled) {
      const sounds = BookSounds.getInstance();
      sounds.playFlip();
    }
  };

  const handleBookReady = () => {
    // Воспроизводим звук открытия книги
    if (soundsReady && bookState.soundEnabled) {
      const sounds = BookSounds.getInstance();
      sounds.playOpen();
    }
  };

  // Обновляем настройки звука при изменении
  useEffect(() => {
    if (soundsReady) {
      const sounds = BookSounds.getInstance();
      sounds.setEnabled(bookState.soundEnabled);
    }
  }, [bookState.soundEnabled, soundsReady]);

  if (bookState.isLoading || pages.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-purple-500 mx-auto"></div>
            <div className="absolute inset-0 rounded-full border-4 border-purple-200 opacity-20"></div>
          </div>
          
          <div className="space-y-3">
            <p className="text-white text-2xl font-semibold">{loadingMessage}</p>
            
            {/* Прогресс-бар */}
            <div className="w-80 mx-auto">
              <div className="bg-black/30 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full bg-linear-to-r from-purple-500 to-blue-500 transition-all duration-300 ease-out"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
              <p className="text-purple-300 text-sm mt-2">{Math.round(loadingProgress)}%</p>
            </div>
          </div>

          {/* Подсказки во время загрузки */}
          <div className="mt-8 p-4 bg-black/20 rounded-lg max-w-md mx-auto">
            <p className="text-purple-200 text-sm mb-2">
              💡 <strong>Совет:</strong> Используйте клавиши ← → для навигации, M для звука, F для полноэкранного режима
            </p>
            {loadingProgress > 10 && (
              <p className="text-blue-200 text-xs">
                📄 Конвертируем PDF в высококачественные изображения для плавного перелистывания
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
      {/* Фоновые декоративные элементы */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
        <div className="absolute top-1/4 right-1/3 w-48 h-48 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse delay-700"></div>
      </div>

      {/* Главный контент */}
      <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
        <BookViewer
          pages={pages}
          currentPage={bookState.currentPage}
          onPageChange={handlePageChange}
          onOrientationChange={(orientation: 'portrait' | 'landscape') => {
            console.log('🔄 Ориентация изменена:', orientation);
          }}
        />
      </div>

      {/* Контролы книги */}
      <BookControls
        currentPage={bookState.currentPage}
        totalPages={bookState.totalPages}
        soundEnabled={bookState.soundEnabled}
        isFullscreen={bookState.isFullscreen}
        showControls={bookState.showControls}
        onPrevPage={bookActions.prevPage}
        onNextPage={bookActions.nextPage}
        onToggleSound={bookActions.toggleSound}
        onToggleFullscreen={bookActions.toggleFullscreen}
        onGoToPage={bookActions.goToPage}
        isMobile={bookState.isMobile}
      />

      {/* Информационная панель */}
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-black/20 backdrop-blur-sm rounded-lg p-3 text-white text-xs opacity-50 hover:opacity-100 transition-all duration-300">
          <div className="font-semibold mb-2 text-purple-200">🎮 Управление:</div>
          <div className="space-y-1">
            <div>← → Навигация</div>
            <div>M - Звук ({bookState.soundEnabled ? '🔊' : '🔇'})</div>
            <div>F - Полный экран</div>
            <div>Home/End - Первая/Последняя</div>
          </div>
          {soundsReady && (
            <div className="mt-2 pt-2 border-t border-white/20">
              <div className="text-green-300">🎵 Звуки готовы</div>
            </div>
          )}
          <div className="mt-2 pt-2 border-t border-white/20">
            <a 
              href="/book/diagnostic" 
              className="text-blue-300 hover:text-blue-200 underline"
              title="Диагностика проблем"
            >
              🔧 Диагностика
            </a>
          </div>
        </div>
      </div>

      {/* Индикатор звука */}
      {soundsReady && bookState.soundEnabled && (
        <div className="fixed top-4 left-4 z-50">
          <div className="bg-green-500/20 backdrop-blur-sm rounded-full p-2 text-green-400">
            <span className="text-sm">🎵</span>
          </div>
        </div>
      )}
    </div>
  );
}
