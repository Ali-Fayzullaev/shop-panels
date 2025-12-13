// src/app/book/page.tsx
'use client';

import React, { useEffect, useState, useRef } from 'react';
import BookViewer from '@/components/BookViewer';
import BookControls from '@/components/BookControls';
import { PDFLoader } from '@/lib/pdfLoader';
import { X, ZoomIn } from 'lucide-react';

// Компонент галереи
interface GalleryViewProps {
  pages: string[];
  onPageSelect: (pageIndex: number) => void;
  onClose: () => void;
  currentPage: number;
}

const GalleryView: React.FC<GalleryViewProps> = ({ pages, onPageSelect, onClose, currentPage }) => {
  return (
    <div className="fixed inset-0 bg-black/95 z-50 overflow-auto">
      {/* Заголовок и кнопка закрытия */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-white/10 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Галерея страниц</h2>
            <p className="text-white/60 text-sm">Нажмите на любую страницу для перехода</p>
          </div>
          <button
            onClick={onClose}
            className="p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Сетка страниц */}
      <div className="p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 max-w-7xl mx-auto">
          {pages.map((page, index) => (
            <div
              key={index}
              onClick={() => onPageSelect(index)}
              className={`
                relative group cursor-pointer transform transition-all duration-300 hover:scale-105
                ${currentPage === index ? 'ring-4 ring-blue-500 ring-opacity-70' : ''}
              `}
            >
              {/* Миниатюра страницы */}
              <div className="relative aspect-3/4 overflow-hidden bg-white shadow-lg">
                <img
                  src={page}
                  alt={`Страница ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                
                {/* Оверлей при наведении */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center">
                  <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
                
                {/* Индикатор текущей страницы */}
                {currentPage === index && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                    Текущая
                  </div>
                )}
              </div>
              
              {/* Номер страницы */}
              <div className="mt-2 text-center">
                <span className="text-white/80 text-sm font-medium">Стр. {index + 1}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Подсказка внизу */}
      <div className="sticky bottom-0 bg-black/80 backdrop-blur-md border-t border-white/10 p-4">
        <div className="text-center">
          <p className="text-white/60 text-sm">
            Отображается {pages.length} страниц • Нажмите ESC для выхода
          </p>
        </div>
      </div>
    </div>
  );
};

export default function BookPage() {
  const [pages, setPages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCompletedNotification, setShowCompletedNotification] = useState(false);
  const [isGalleryMode, setIsGalleryMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Инициализация
  useEffect(() => {
    // Предзагрузка аудио
    try {
      audioRef.current = new Audio('/sounds/flip.mp3');
      audioRef.current.preload = 'auto';
      audioRef.current.volume = 0.25;
    } catch (error) {
      console.log('Не удалось загрузить аудио файл:', error);
    }
    
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Умное скрытие контролов
  useEffect(() => {
    const show = () => {
      setShowControls(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      // Увеличиваем время до скрытия на мобильных
      const hideDelay = isMobile ? 4000 : 3000;
      timeoutRef.current = setTimeout(() => setShowControls(false), hideDelay);
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
  }, [isMobile]);

  // 3. Прогрессивная загрузка страниц
  useEffect(() => {
    const load = async () => {
      try {
        // БЫСТРЫЙ СТАРТ - сначала показываем демо первую страницу
        const firstDemoPage = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
          <svg width="600" height="850" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bg-loading" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#f0f9ff;stop-opacity:1" />
              </linearGradient>
            </defs>
            <rect width="600" height="850" fill="url(#bg-loading)"/>
            <rect x="40" y="40" width="520" height="770" fill="none" stroke="#e2e8f0" stroke-width="2" rx="12"/>
            
            <!-- Логотип или заголовок -->
            <text x="300" y="120" text-anchor="middle" font-family="serif" font-size="36" font-weight="bold" fill="#1e293b">
              КАТАЛОГ ПАНЕЛЕЙ
            </text>
            <text x="300" y="160" text-anchor="middle" font-family="sans-serif" font-size="16" fill="#64748b">
              Загружаем страницы...
            </text>
            
            <!-- Анимированный индикатор загрузки -->
            <circle cx="300" cy="400" r="60" fill="none" stroke="#e2e8f0" stroke-width="4"/>
            <circle cx="300" cy="400" r="60" fill="none" stroke="#3b82f6" stroke-width="4" 
                    stroke-dasharray="377" stroke-dashoffset="377" opacity="0.8">
              <animate attributeName="stroke-dashoffset" values="377;0;377" dur="2s" repeatCount="indefinite"/>
            </circle>
            
            <text x="300" y="410" text-anchor="middle" font-family="sans-serif" font-size="18" fill="#3b82f6">
              Загрузка...
            </text>
            
            <!-- Информация -->
            <text x="300" y="520" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#6b7280">
              Премиум качество стеновых панелей
            </text>
            <text x="300" y="550" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#6b7280">
              Современные технологии • Стильный дизайн
            </text>
            
            <!-- Прогресс бар -->
            <rect x="150" y="600" width="300" height="8" fill="#e2e8f0" rx="4"/>
            <rect x="150" y="600" width="0" height="8" fill="#3b82f6" rx="4">
              <animate attributeName="width" values="0;300;0" dur="3s" repeatCount="indefinite"/>
            </rect>
            
            <text x="300" y="800" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#9ca3af">
              www.marmarill.kz • Каталог продукции
            </text>
          </svg>
        `)}`;
        
        // Сразу показываем первую страницу, но НЕ убираем экран загрузки
        setPages([firstDemoPage]);
        // НЕ убираем экран загрузки! setLoading(false); 
        setProgress(5); // Показываем небольшой прогресс
        
        console.log('🚀 Быстрый старт - показываем первую страницу');
        
        // Теперь пробуем загрузить настоящий PDF в фоне
        const pdfSources = [
          '/FlipbookViewer.pdf',
          '/pdf/catalog.pdf',
          'https://marmarill.kz/FlipbookViewer.pdf'
        ];
        
        let pdfPages = null;
        let lastError = null;
        
        // Загружаем PDF в фоновом режиме с прогрессивной загрузкой
        for (const source of pdfSources) {
          try {
            console.log(`🔄 Прогрессивная загрузка PDF из: ${source}`);
            
            // Используем прогрессивную загрузку
            pdfPages = await PDFLoader.loadPDFWithProgressiveLoading(
              source,
              (loaded, total) => {
                // Правильно ограничиваем прогресс от 5% до 95%
                const ratio = Math.min(loaded / total, 1); // Не больше 1
                const progress = Math.min(5 + ratio * 90, 95); // Не больше 95%
                setProgress(progress);
              },
              (firstPages) => {
                // Как только первые 10 страниц готовы, сразу показываем их и убираем экран загрузки
                console.log(`⚡ Первые ${firstPages.length} страниц готовы! Убираем экран загрузки.`);
                setPages(firstPages);
                setProgress(50); // Показываем 50% так как основная часть готова
                
                // УБИРАЕМ экран загрузки - пользователь может уже пользоваться книгой!
                setTimeout(() => {
                  setLoading(false);
                }, 300); // Небольшая задержка для плавности
              },
              { scale: 2.5 }
            );
            
            if (pdfPages && pdfPages.length > 0) {
              console.log(`✅ Полная прогрессивная загрузка завершена из: ${source}`);
              setPages(pdfPages); // Обновляем на полный набор страниц
              setProgress(100);
              
              // Показываем уведомление о завершении загрузки (экран загрузки уже убран)
              setShowCompletedNotification(true);
              
              // Автоматически скрываем уведомление через 3 секунды
              setTimeout(() => {
                setShowCompletedNotification(false);
              }, 3000);
              
              return;
            }
          } catch (error) {
            lastError = error;
            console.warn(`❌ Прогрессивная загрузка не удалась из ${source}:`, error);
            continue;
          }
        }
        
        // Если PDF не загрузился, показываем красивый демо-контент
        if (!pdfPages || pdfPages.length === 0) {
          console.log('📚 Показываем улучшенный демо-контент');
          
          const demoPages = Array.from({ length: 12 }, (_, i) => {
            const pageNum = i + 1;
            
            return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
              <svg width="600" height="850" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="bg-${i}" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#f8fafc;stop-opacity:1" />
                  </linearGradient>
                  <linearGradient id="accent-${i}" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:0.1" />
                    <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:0.2" />
                  </linearGradient>
                </defs>
                
                <rect width="600" height="850" fill="url(#bg-${i})"/>
                <rect width="600" height="850" fill="url(#accent-${i})"/>
                <rect x="40" y="40" width="520" height="770" fill="none" stroke="#e2e8f0" stroke-width="2" rx="8"/>
                
                <text x="300" y="120" text-anchor="middle" font-family="serif" font-size="32" font-weight="bold" fill="#1e293b">
                  КАТАЛОГ ПАНЕЛЕЙ
                </text>
                <text x="300" y="160" text-anchor="middle" font-family="sans-serif" font-size="16" fill="#64748b">
                  Премиум качество • Современный дизайн
                </text>
                
                <circle cx="300" cy="400" r="80" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="3"/>
                <text x="300" y="420" text-anchor="middle" font-family="sans-serif" font-size="64" font-weight="bold" fill="#334155">
                  ${pageNum}
                </text>
                
                <text x="300" y="520" text-anchor="middle" font-family="sans-serif" font-size="18" fill="#475569">
                  Страница ${pageNum}
                </text>
                
                <circle cx="150" cy="650" r="40" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
                <circle cx="450" cy="650" r="40" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
                
                <text x="300" y="700" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#6b7280">
                  • Высокое качество материалов
                </text>
                <text x="300" y="730" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#6b7280">
                  • Современные технологии производства
                </text>
                <text x="300" y="760" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#6b7280">
                  • Долговечность и надежность
                </text>
                
                <line x1="80" y1="800" x2="520" y2="800" stroke="#e2e8f0" stroke-width="1"/>
                <text x="300" y="825" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#9ca3af">
                  www.marmarill.kz • Каталог продукции
                </text>
              </svg>
            `)}`
          });
          
          // Быстро показываем первые 10 страниц демо-контента
          const firstDemoPages = demoPages.slice(0, 10);
          setTimeout(() => {
            setPages(firstDemoPages);
            setProgress(50);
            setLoading(false); // Убираем экран загрузки после первых 10 страниц
            
            // Затем подгружаем остальные страницы в фоне
            setTimeout(() => {
              setPages(demoPages);
              setProgress(100);
            }, 1000);
          }, 500);
        }
        
      } catch (e) {
        console.error('🚨 Критическая ошибка загрузки:', e);
        setProgress(100);
        // Показываем пользователю, что загрузка завершена даже при ошибке
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };
    
    load();
  }, []);

  // Главная функция смены страниц с звуком
  const playPageFlipSound = () => {
    if (audioRef.current && soundEnabled) {
      try {
        audioRef.current.currentTime = 0;
        audioRef.current.volume = 0.25;
        audioRef.current.play().catch(() => {
          console.log('Звук не может быть воспроизведен');
        });
      } catch (error) {
        console.log('Ошибка воспроизведения звука:', error);
      }
    }
  };

  const handlePageChange = (idx: number) => {
    if (idx >= 0 && idx < pages.length && idx !== currentPage) {
      setCurrentPage(idx);
      playPageFlipSound();
    }
  };

  const toggleGalleryMode = () => {
    // Разрешаем галерею только после полной загрузки
    if (progress === 100) {
      setIsGalleryMode(!isGalleryMode);
    }
  };

  const goToPage = (pageIndex: number) => {
    if (pageIndex >= 0 && pageIndex < pages.length) {
      setCurrentPage(pageIndex);
      setIsGalleryMode(false); // Возвращаемся к обычному режиму
      playPageFlipSound();
    }
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  const goToPreviousPage = () => {
    const newPage = currentPage - 1;
    if (newPage >= 0) {
      handlePageChange(newPage);
    }
  };

  const goToNextPage = () => {
    const newPage = currentPage + 1;
    if (newPage < pages.length) {
      handlePageChange(newPage);
    }
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.log('Ошибка переключения полноэкранного режима:', error);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[linear-gradient(to_bottom_right,rgb(23,23,23),rgb(38,38,38),rgb(0,0,0))] text-white relative overflow-hidden px-4">
        {/* Анимированный фон для мобильных и десктоп */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-64 sm:h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        {/* Центральный контент */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-sm mx-auto">
          
          {/* Логотип */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[linear-gradient(to_right,rgb(59,130,246),rgb(147,51,234))] rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl mb-6 sm:mb-8">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
            </svg>
          </div>
          
          {/* Заголовок */}
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-[linear-gradient(to_right,rgb(255,255,255),rgb(191,219,254))] bg-clip-text text-transparent mb-6 sm:mb-8">
            Пожалуйста, подождите
          </h1>
          
          {/* Анимированный индикатор загрузки */}
          <div className="relative mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 border-3 sm:border-4 border-white/20 border-t-blue-500 rounded-full animate-spin"/>
            <div className="absolute inset-0 w-16 h-16 sm:w-20 sm:h-20 border-3 sm:border-4 border-transparent border-r-purple-500 rounded-full animate-spin animate-reverse"/>
          </div>
          
          {/* Прогресс */}
          <div className="w-full">
            <div className="text-3xl sm:text-4xl font-bold text-blue-400 mb-3 sm:mb-4">
              {Math.round(Math.min(progress, 100))}%
            </div>
            <div className="w-full max-w-xs h-2 bg-white/20 rounded-full overflow-hidden mx-auto">
              <div 
                className="h-full bg-[linear-gradient(to_right,rgb(59,130,246),rgb(168,85,247))] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#1a1a1a]">
        {/* Текстурированный фон (Деревянный стол или темный градиент) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-neutral-800 via-neutral-900 to-black" />
        
        {/* Индикатор фоновой загрузки (менее навязчивый) */}
        {progress < 100 && progress >= 50 && (
          <div className="absolute top-5 right-5 bg-black/60 text-white/80 px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 backdrop-blur-sm border border-white/5 z-40 transition-all duration-500">
            <div className="w-3 h-3 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
            <span>
              Загрузка остальных страниц... {Math.round(Math.min(progress, 100))}%
            </span>
          </div>
        )}
        
        {/* Уведомление о завершении загрузки */}
        {showCompletedNotification && (
          <div className="absolute top-5 right-5 bg-green-600/90 text-white px-5 py-3 rounded-full text-sm font-medium flex items-center gap-3 backdrop-blur-md border border-green-400/20 z-50 animate-bounce">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Каталог загружен!</span>
          </div>
        )}
        
        {/* Основной контейнер книги */}
        <div className="relative z-10 h-full w-full flex flex-col items-center justify-center">
            {isGalleryMode ? (
              <GalleryView 
                pages={pages} 
                onPageSelect={goToPage} 
                onClose={() => setIsGalleryMode(false)}
                currentPage={currentPage}
              />
            ) : (
              <BookViewer 
                  pages={pages}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
              />
            )}
        </div>
        
        {/* Контролы */}
        {!isGalleryMode ? (
          <BookControls
            currentPage={currentPage}
            totalPages={pages.length}
            soundEnabled={soundEnabled}
            isFullscreen={isFullscreen}
            showControls={showControls}
            onPrevPage={() => {
              console.log('👈 Клик по кнопке "Назад"');
              goToPreviousPage();
            }}
            onNextPage={() => {
              console.log('👉 Клик по кнопке "Вперед"');
              goToNextPage();
            }}
            onToggleSound={toggleSound}
            onToggleFullscreen={toggleFullscreen}
            onToggleGallery={toggleGalleryMode}
            galleryAvailable={progress === 100}
            isMobile={isMobile}
          />
        ) :
          (
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
          )
        
        }

        {/* Контролы */}
       
    </div>
  );
}