'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

// Типы для PDF.js
declare global {
  interface Window {
    pdfjsLib: any;
  }
}

export default function BookPage() {
  const bookRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pdfPages, setPdfPages] = useState<string[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [pdfLib, setPdfLib] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);

  // Определение мобильного устройства
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Быстрая загрузка только PDF.js
  useEffect(() => {
    const loadPdfJs = () => {
      if (typeof window === 'undefined') return;

      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.onload = () => {
        if (window.pdfjsLib) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          setPdfLib(window.pdfjsLib);
        }
      };
      script.onerror = () => {
        console.error('Ошибка загрузки PDF.js');
      };
      
      document.head.appendChild(script);
    };

    loadPdfJs();
  }, []);

  // Загрузка и конвертация PDF в изображения
  const loadPDF = useCallback(async () => {
    if (!pdfLib) return;
    
    try {
      setIsLoading(true);
      const loadingTask = pdfLib.getDocument('/FlipbookViewer.pdf');
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;
      setTotalPages(numPages);

      const pagePromises = [];
      for (let i = 1; i <= numPages; i++) {
        pagePromises.push(
          pdf.getPage(i).then(async (page: any) => {
            const scale = 2.0;
            const viewport = page.getViewport({ scale });
            
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d')!;
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            
            const renderContext = {
              canvasContext: context,
              viewport: viewport,
            };
            
            await page.render(renderContext).promise;
            return canvas.toDataURL('image/jpeg', 0.9);
          })
        );
      }

      const pages = await Promise.all(pagePromises);
      setPdfPages(pages);
      setIsLoading(false);
    } catch (error) {
      console.error('Ошибка загрузки PDF:', error);
      setIsLoading(false);
    }
  }, [pdfLib]);

  // Загрузка PDF когда библиотека готова
  useEffect(() => {
    if (pdfLib) {
      loadPDF();
    }
  }, [pdfLib, loadPDF]);

  // Функции навигации с анимацией
  const nextPage = () => {
    if (isFlipping) return;
    
    const maxPage = isMobile ? totalPages - 1 : Math.floor((totalPages - 1) / 2);
    if (currentPage < maxPage) {
      setIsFlipping(true);
      setCurrentPage(currentPage + 1);
      playFlipSound();
      
      setTimeout(() => setIsFlipping(false), 600);
    }
  };

  const prevPage = () => {
    if (isFlipping) return;
    
    if (currentPage > 0) {
      setIsFlipping(true);
      setCurrentPage(currentPage - 1);
      playFlipSound();
      
      setTimeout(() => setIsFlipping(false), 600);
    }
  };

  const playFlipSound = () => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  // Получение текущих страниц для отображения
  const getCurrentPages = () => {
    if (isMobile) {
      return [pdfPages[currentPage]];
    } else {
      // На десктопе показываем две страницы
      const leftPage = currentPage * 2;
      const rightPage = leftPage + 1;
      return [
        pdfPages[leftPage] || null,
        pdfPages[rightPage] || null
      ];
    }
  };

  const currentPages = getCurrentPages();

  // Управление полноэкранным режимом
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(() => {});
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(() => {});
    }
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabled(!soundEnabled);
  }, [soundEnabled]);

  // Скрытие/показ контролов
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const resetTimeout = () => {
      clearTimeout(timeout);
      setShowControls(true);
      timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };

    const handleUserActivity = () => {
      resetTimeout();
    };

    document.addEventListener('mousemove', handleUserActivity);
    document.addEventListener('touchstart', handleUserActivity);
    document.addEventListener('click', handleUserActivity);

    resetTimeout();

    return () => {
      clearTimeout(timeout);
      document.removeEventListener('mousemove', handleUserActivity);
      document.removeEventListener('touchstart', handleUserActivity);
      document.removeEventListener('click', handleUserActivity);
    };
  }, []);

  // Клавиатурная навигация
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        prevPage();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        nextPage();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [currentPage, totalPages, isFlipping]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-xl font-semibold">Загрузка книги...</p>
          <p className="text-purple-300 text-sm mt-2">Конвертируем PDF страницы</p>
        </div>
      </div>
    );
  }

  const displayTotalPages = isMobile ? totalPages : Math.ceil(totalPages / 2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
      {/* Звуковой файл для перелистывания */}
      <audio ref={audioRef} preload="auto">
        <source src="/sounds/flip.mp3" type="audio/mpeg" />
      </audio>

      {/* Основной контейнер книги */}
      <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
        <div 
          ref={bookRef}
          className={`book-container relative transition-all duration-600 ease-in-out ${
            isFlipping ? 'scale-95' : 'scale-100'
          }`}
          style={{
            perspective: '1000px',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Книга */}
          <div 
            className={`book shadow-2xl rounded-lg overflow-hidden bg-white ${
              isMobile ? 'mobile-book' : 'desktop-book'
            }`}
            style={{
              width: isMobile ? '350px' : '800px',
              height: isMobile ? '500px' : '600px',
              transformStyle: 'preserve-3d',
              transform: isFlipping ? 'rotateY(5deg)' : 'rotateY(0deg)',
              transition: 'transform 0.6s ease-in-out'
            }}
          >
            {isMobile ? (
              // Мобильная версия - одна страница
              <div 
                className="page-single w-full h-full relative overflow-hidden"
                style={{
                  backgroundImage: currentPages[0] ? `url(${currentPages[0]})` : 'none',
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                }}
              >
                {currentPages[0] && (
                  <div className="absolute bottom-4 right-4 bg-black/20 text-white px-2 py-1 rounded text-xs">
                    {currentPage + 1}
                  </div>
                )}
              </div>
            ) : (
              // Десктопная версия - две страницы
              <div className="flex w-full h-full">
                {/* Левая страница */}
                <div 
                  className="page-left w-1/2 h-full relative border-r border-gray-300"
                  style={{
                    backgroundImage: currentPages[0] ? `url(${currentPages[0]})` : 'none',
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    transform: isFlipping ? 'rotateY(-10deg)' : 'rotateY(0deg)',
                    transition: 'transform 0.6s ease-in-out'
                  }}
                >
                  {currentPages[0] && (
                    <div className="absolute bottom-4 left-4 bg-black/20 text-white px-2 py-1 rounded text-xs">
                      {currentPage * 2 + 1}
                    </div>
                  )}
                </div>
                
                {/* Правая страница */}
                <div 
                  className="page-right w-1/2 h-full relative"
                  style={{
                    backgroundImage: currentPages[1] ? `url(${currentPages[1]})` : 'none',
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    transform: isFlipping ? 'rotateY(10deg)' : 'rotateY(0deg)',
                    transition: 'transform 0.6s ease-in-out'
                  }}
                >
                  {currentPages[1] && (
                    <div className="absolute bottom-4 right-4 bg-black/20 text-white px-2 py-1 rounded text-xs">
                      {currentPage * 2 + 2}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Боковые кнопки навигации для десктопа */}
        <div className="hidden md:flex absolute inset-y-0 left-0 right-0 pointer-events-none">
          {/* Левая кнопка */}
          <button
            onClick={prevPage}
            disabled={currentPage <= 0 || isFlipping}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-16 h-16 rounded-full bg-black/30 hover:bg-black/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center text-white backdrop-blur-sm border border-white/20 pointer-events-auto z-30"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Правая кнопка */}
          <button
            onClick={nextPage}
            disabled={currentPage >= Math.floor((totalPages - 1) / 2) || isFlipping}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-16 h-16 rounded-full bg-black/30 hover:bg-black/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center text-white backdrop-blur-sm border border-white/20 pointer-events-auto z-30"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Панель управления */}
      <div 
        className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
          showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 md:opacity-100 md:translate-y-0'
        }`}
      >
        <div className="bg-black/40 backdrop-blur-md rounded-full px-6 py-3 flex items-center space-x-4">
          {/* Предыдущая страница */}
          <button
            onClick={prevPage}
            disabled={currentPage <= 0 || isFlipping}
            className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Индикатор страниц */}
          <div className="text-white text-sm font-medium">
            {currentPage + 1} / {displayTotalPages}
            {!isMobile && (
              <span className="text-xs opacity-70 ml-1">(развороты)</span>
            )}
          </div>

          {/* Следующая страница */}
          <button
            onClick={nextPage}
            disabled={currentPage >= displayTotalPages - 1 || isFlipping}
            className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Звук */}
          <button
            onClick={toggleSound}
            className={`w-12 h-12 rounded-full transition-all duration-200 flex items-center justify-center text-white ${
              soundEnabled ? 'bg-green-500/30 hover:bg-green-500/40' : 'bg-red-500/30 hover:bg-red-500/40'
            }`}
          >
            {soundEnabled ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            )}
          </button>

          {/* Полноэкранный режим */}
          <button
            onClick={toggleFullscreen}
            className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 flex items-center justify-center text-white"
          >
            {isFullscreen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Боковые области для мобильной навигации */}
      <button
        onClick={prevPage}
        disabled={isFlipping}
        className="fixed left-0 top-0 w-1/4 h-full z-40 opacity-0 md:hidden"
        aria-label="Предыдущая страница"
      />
      <button
        onClick={nextPage}
        disabled={isFlipping}
        className="fixed right-0 top-0 w-1/4 h-full z-40 opacity-0 md:hidden"
        aria-label="Следующая страница"
      />

      {/* Декоративные элементы фона */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>
    </div>
  );
}