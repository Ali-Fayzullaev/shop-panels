'use client';

import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import BookViewer from '@/components/BookViewer';
import BookControls from '@/components/BookControls';
import { PDFLoader } from '@/lib/pdfLoader';
import { X, ZoomIn, RefreshCw } from 'lucide-react';

// Константы для кеширования - ОБНОВЛЕНО
const CACHE_KEY = 'catalog_pages_cache_v3'; // Новая версия
const CACHE_TIMESTAMP_KEY = 'catalog_cache_timestamp_v3';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 часа
const CURRENT_PAGE_KEY = 'catalog_current_page';
const MAX_CACHE_PAGES = 8; // Кешируем только первые 8 страниц
const CACHE_IMAGE_QUALITY = 0.6; // Качество сжатия 60%
const MAX_CACHE_SIZE_MB = 4; // Максимум 4MB для кеша

// Утилиты для работы с кешем - ПОЛНОСТЬЮ ПЕРЕПИСАНО
const CacheUtils = {
  // Сжатие изображения
  compressImage: async (base64: string): Promise<string> => {
    return new Promise((resolve) => {
      try {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Уменьшаем размер для кеша (максимум 800x600)
          const maxWidth = 800;
          const maxHeight = 600;
          let { width, height } = img;
          
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Сжимаем в JPEG с качеством 60%
          const compressed = canvas.toDataURL('image/jpeg', CACHE_IMAGE_QUALITY);
          resolve(compressed);
        };
        img.onerror = () => resolve(base64); // Если ошибка, возвращаем оригинал
        img.src = base64;
      } catch (error) {
        resolve(base64); // При ошибке возвращаем оригинал
      }
    });
  },

  // Проверка размера данных
  getDataSize: (data: any): number => {
    try {
      const jsonString = JSON.stringify(data);
      return new Blob([jsonString]).size;
    } catch {
      return 0;
    }
  },

  // Умное сохранение с проверками
  save: async (pages: string[]) => {
    try {
      // Кешируем только первые страницы
      const pagesToCache = pages.slice(0, MAX_CACHE_PAGES);
      
      console.log(`📦 Подготовка к кешированию ${pagesToCache.length} страниц...`);
      
      // Сжимаем изображения
      const compressedPages = await Promise.all(
        pagesToCache.map(async (page, index) => {
          console.log(`🔄 Сжатие страницы ${index + 1}/${pagesToCache.length}`);
          return await CacheUtils.compressImage(page);
        })
      );

      const cacheData = {
        pages: compressedPages,
        totalOriginalPages: pages.length,
        compressed: true,
        timestamp: Date.now()
      };

      // Проверяем размер
      const dataSize = CacheUtils.getDataSize(cacheData);
      const dataSizeMB = dataSize / (1024 * 1024);
      
      console.log(`📊 Размер кеша: ${dataSizeMB.toFixed(2)}MB`);
      
      if (dataSizeMB > MAX_CACHE_SIZE_MB) {
        console.warn(`⚠️ Кеш слишком большой (${dataSizeMB.toFixed(2)}MB), пропускаем сохранение`);
        return false;
      }

      // Пробуем сохранить
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
      
      console.log(`✅ Кеш сохранен: ${compressedPages.length} страниц, ${dataSizeMB.toFixed(2)}MB`);
      return true;
      
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.warn('🚨 localStorage переполнен, очищаем старые данные...');
        CacheUtils.clearOldData();
        return false;
      } else {
        console.warn('❌ Ошибка сохранения в кеш:', error);
        return false;
      }
    }
  },

  // Загрузка с проверкой сжатия
  load: () => {
    try {
      const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
      if (!timestamp) return null;
      
      const age = Date.now() - parseInt(timestamp);
      if (age > CACHE_DURATION) {
        CacheUtils.clear();
        return null;
      }
      
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const cacheData = JSON.parse(cached);
        
        // Новый формат с мета-данными
        if (cacheData.pages && Array.isArray(cacheData.pages)) {
          console.log(`✅ Загружено из кеша: ${cacheData.pages.length} страниц${cacheData.compressed ? ' (сжато)' : ''}`);
          return {
            pages: cacheData.pages,
            totalPages: cacheData.totalOriginalPages || cacheData.pages.length,
            isPartialCache: cacheData.totalOriginalPages > cacheData.pages.length
          };
        }
        
        // Старый формат (массив)
        if (Array.isArray(cacheData)) {
          console.log(`✅ Загружено из старого кеша: ${cacheData.length} страниц`);
          return {
            pages: cacheData,
            totalPages: cacheData.length,
            isPartialCache: false
          };
        }
      }
    } catch (error) {
      console.warn('❌ Ошибка загрузки кеша:', error);
      CacheUtils.clear();
    }
    return null;
  },

  // Очистка всех данных кеша
  clear: () => {
    try {
      localStorage.removeItem(CACHE_KEY);
      localStorage.removeItem(CACHE_TIMESTAMP_KEY);
      // Очищаем и старые версии
      localStorage.removeItem('catalog_pages_cache_v2');
      localStorage.removeItem('catalog_cache_timestamp');
    } catch (error) {
      console.warn('❌ Ошибка очистки кеша:', error);
    }
  },

  // Очистка старых данных для освобождения места
  clearOldData: () => {
    try {
      const keysToCheck = [
        'catalog_pages_cache',
        'catalog_pages_cache_v1', 
        'catalog_pages_cache_v2',
        'book_cache',
        'flipbook_cache',
        'temp_images'
      ];
      
      keysToCheck.forEach(key => {
        try {
          localStorage.removeItem(key);
        } catch (e) {}
      });
      
      console.log('🧹 Старые данные кеша очищены');
    } catch (error) {
      console.warn('❌ Ошибка очистки старых данных:', error);
    }
  },

  saveCurrentPage: (page: number) => {
    try {
      sessionStorage.setItem(CURRENT_PAGE_KEY, page.toString());
    } catch (error) {
      console.warn('❌ Ошибка сохранения текущей страницы:', error);
    }
  },

  loadCurrentPage: () => {
    try {
      const saved = sessionStorage.getItem(CURRENT_PAGE_KEY);
      return saved ? parseInt(saved) : 0;
    } catch (error) {
      return 0;
    }
  }
};

// Компонент галереи (оптимизированный)
interface GalleryViewProps {
  pages: string[];
  onPageSelect: (pageIndex: number) => void;
  onClose: () => void;
  currentPage: number;
}

const GalleryView: React.FC<GalleryViewProps> = React.memo(({ 
  pages, 
  onPageSelect, 
  onClose, 
  currentPage 
}) => {
  // ИСПРАВЛЕНО: Всегда показываем все страницы
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: pages.length });
  
  // ОБНОВЛЕНО: Обновляем диапазон при изменении количества страниц
  useEffect(() => {
    setVisibleRange({ start: 0, end: pages.length });
  }, [pages.length]);
  
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    // Для больших каталогов (>100 страниц) можно включить виртуализацию
    if (pages.length > 100) {
      const scrollTop = e.currentTarget.scrollTop;
      const itemHeight = 200;
      const itemsPerRow = Math.floor(window.innerWidth / 180);
      const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) * itemsPerRow - 20);
      const endIndex = Math.min(pages.length, startIndex + 80);
      
      setVisibleRange({ start: startIndex, end: endIndex });
    }
  }, [pages.length]);

  const visiblePages = useMemo(() => {
    // ИСПРАВЛЕНО: Всегда показываем все страницы до 100
    if (pages.length <= 100) {
      return pages.map((page, index) => ({ page, index }));
    }
    
    // Только для очень больших каталогов используем виртуализацию
    return pages.slice(visibleRange.start, visibleRange.end).map((page, index) => ({
      page,
      index: visibleRange.start + index
    }));
  }, [pages, visibleRange]);

  return (
    <div className="fixed inset-0 bg-black/95 z-50 overflow-auto">
      <div className="sticky top-0 z-10 bg-black/90 backdrop-blur-md border-b border-white/10 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">Галерея страниц</h2>
            <p className="text-white/60 text-sm">Всего {pages.length} страниц • Нажмите для перехода</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 sm:p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6" onScroll={handleScroll}>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 max-w-7xl mx-auto">
          {visiblePages.map(({ page, index }) => (
            <div
              key={index}
              onClick={() => onPageSelect(index)}
              className={`
                relative group cursor-pointer transform transition-all duration-300 hover:scale-105
                ${currentPage === index ? 'ring-2 sm:ring-4 ring-blue-500 ring-opacity-70' : ''}
              `}
            >
              <div className="relative aspect-3/4 overflow-hidden bg-white shadow-lg rounded-md">
                <img
                  src={page}
                  alt={`Страница ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center">
                  <ZoomIn className="w-6 h-6 sm:w-8 sm:h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
                
                {currentPage === index && (
                  <div className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-blue-500 text-white text-xs px-1.5 sm:px-2 py-1 rounded-full font-semibold">
                    Текущая
                  </div>
                )}
              </div>
              
              <div className="mt-1 sm:mt-2 text-center">
                <span className="text-white/80 text-xs sm:text-sm font-medium">Стр. {index + 1}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

GalleryView.displayName = 'GalleryView';

// Компонент загрузки (улучшенный)
const LoadingScreen: React.FC<{ progress: number; onForceStart: () => void }> = React.memo(({ 
  progress, 
  onForceStart 
}) => (
  <div className="h-screen w-full flex flex-col items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-black text-white relative overflow-hidden px-4">
    <div className="absolute inset-0 opacity-20">
      <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-64 sm:h-64 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-1000" />
    </div>
    
    <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-md mx-auto">
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-linear-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-2xl mb-6 sm:mb-8">
        <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
        </svg>
      </div>
      
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-linear-to-r from-white to-blue-200 bg-clip-text text-transparent mb-4">
        Загрузка каталога
      </h1>
      
      <p className="text-white/70 text-sm sm:text-base mb-8 leading-relaxed">
        Подготавливаем страницы для быстрого просмотра...
      </p>
      
      <div className="relative mb-6">
        <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-white/20 border-t-blue-500 rounded-full animate-spin"/>
      </div>
      
      <div className="w-full mb-6">
        <div className="text-2xl sm:text-3xl font-bold text-blue-400 mb-3">
          {Math.round(progress)}%
        </div>
        <div className="w-full max-w-sm h-2 bg-white/20 rounded-full overflow-hidden mx-auto">
          <div 
            className="h-full bg-linear-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      {progress > 30 && (
        <button
          onClick={onForceStart}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-all duration-200 flex items-center gap-2"
        >
          <span>Начать просмотр</span>
          <RefreshCw className="w-4 h-4" />
        </button>
      )}
    </div>
  </div>
));

LoadingScreen.displayName = 'LoadingScreen';

export default function BookPage() {
  const [pages, setPages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isGalleryMode, setIsGalleryMode] = useState(false);
  const [backgroundLoading, setBackgroundLoading] = useState(false);
  const [totalExpectedPages, setTotalExpectedPages] = useState(0); // НОВОЕ: ожидаемое количество страниц
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const loadingRef = useRef<boolean>(false);

  // Проверка мобильного устройства
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Умное скрытие контролов
  useEffect(() => {
    const show = () => {
      setShowControls(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      const hideDelay = isMobile ? 4000 : 3000;
      timeoutRef.current = setTimeout(() => setShowControls(false), hideDelay);
    };

    const events = ['mousemove', 'touchstart', 'click', 'keydown'];
    events.forEach(event => window.addEventListener(event, show));
    show();

    return () => {
      events.forEach(event => window.removeEventListener(event, show));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isMobile]);

  // Сохранение текущей страницы
  useEffect(() => {
    CacheUtils.saveCurrentPage(currentPage);
  }, [currentPage]);

  // Основная загрузка с кешированием - ОБНОВЛЕНО для фоновой загрузки
  const loadPages = useCallback(async (forceReload = false) => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    try {
      // Сначала проверяем кеш
      if (!forceReload) {
        const cacheResult = CacheUtils.load();
        if (cacheResult && cacheResult.pages.length > 0) {
          console.log('⚡ МГНОВЕННАЯ ЗАГРУЗКА из кеша');
          setPages(cacheResult.pages);
          setCurrentPage(CacheUtils.loadCurrentPage());
          setProgress(100);
          setLoading(false);
          
          // НОВОЕ: Если это частичный кеш, запускаем фоновую загрузку
          if (cacheResult.isPartialCache) {
            console.log(`📚 Кеш содержит ${cacheResult.pages.length} из ${cacheResult.totalPages} страниц`);
            setTotalExpectedPages(cacheResult.totalPages);
            setBackgroundLoading(true);
            
            // Запускаем фоновую загрузку остальных страниц
            loadingRef.current = false; // Сбрасываем флаг чтобы можно было запустить фоновую загрузку
            setTimeout(() => {
              loadRemainingPages(cacheResult.pages);
            }, 1000); // Даем время пользователю начать просмотр
            
            return;
          }
          
          loadingRef.current = false;
          return;
        }
      }

      // Если кеша нет, показываем первую демо-страницу
      const quickDemoPage = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
        <svg width="600" height="850" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bg" x1="0%" y1="0%" x2="100%">
              <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#f8fafc;stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect width="600" height="850" fill="url(#bg)"/>
          <rect x="40" y="40" width="520" height="770" fill="none" stroke="#e2e8f0" stroke-width="2" rx="12"/>
          
          <text x="300" y="120" text-anchor="middle" font-family="serif" font-size="32" font-weight="bold" fill="#1e293b">
            КАТАЛОГ ПАНЕЛЕЙ
          </text>
          <text x="300" y="160" text-anchor="middle" font-family="sans-serif" font-size="16" fill="#64748b">
            Премиум качество • Современный дизайн
          </text>
          
          <circle cx="300" cy="400" r="80" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="3"/>
          <text x="300" y="420" text-anchor="middle" font-family="sans-serif" font-size="48" font-weight="bold" fill="#334155">
            1
          </text>
          
          <text x="300" y="520" text-anchor="middle" font-family="sans-serif" font-size="18" fill="#475569">
            Загружаем остальные страницы...
          </text>
          
          <text x="300" y="700" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#6b7280">
            • Высокое качество материалов
          </text>
          <text x="300" y="730" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#6b7280">
            • Современные технологии производства
          </text>
          <text x="300" y="760" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#6b7280">
            • Долговечность и надежность
          </text>
          
          <text x="300" y="820" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#9ca3af">
            www.marmarill.kz
          </text>
        </svg>
      `)}`;

      setPages([quickDemoPage]);
      setProgress(10);

      // Пробуем загрузить PDF
      const pdfSources = [
        '/FlipbookViewer.pdf',
        '/pdf/catalog.pdf',
        'https://marmarill.kz/FlipbookViewer.pdf'
      ];

      let loadedPages = null;
      for (const source of pdfSources) {
        try {
          console.log(`🔄 Загрузка PDF: ${source}`);
          
          loadedPages = await PDFLoader.loadPDFWithProgressiveLoading(
            source,
            (loaded, total) => {
              const ratio = Math.min(loaded / total, 1);
              const progress = 10 + ratio * 80;
              setProgress(progress);
            },
            (firstPages) => {
              if (firstPages.length >= 5) {
                console.log(`⚡ Первые ${firstPages.length} страниц готовы`);
                setPages(firstPages);
                setProgress(60);
                setLoading(false);
                setBackgroundLoading(true);
              }
            },
            { scale: 2.0 }
          );

          if (loadedPages && loadedPages.length > 0) {
            console.log(`✅ PDF загружен: ${loadedPages.length} страниц`);
            setPages(loadedPages);
            setProgress(100);
            setLoading(false);
            setBackgroundLoading(false);
            
            // ОБНОВЛЕНО: Умное сохранение в кеш
            console.log('💾 Сохранение в кеш...');
            const cacheSuccess = await CacheUtils.save(loadedPages);
            if (cacheSuccess) {
              console.log('✅ Кеш успешно сохранен');
            } else {
              console.log('⚠️ Кеш не сохранен (слишком большой или ошибка)');
            }
            
            loadingRef.current = false;
            return;
          }
        } catch (error) {
          console.warn(`❌ Ошибка загрузки ${source}:`, error);
          continue;
        }
      }

      // Если PDF не загрузился, создаем демо-контент
      console.log('📚 Создаем демо-контент');
      const demoPages = Array.from({ length: 16 }, (_, i) => {
        const pageNum = i + 1;
        return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
          <svg width="600" height="850" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bg-${i}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#f8fafc;stop-opacity:1" />
              </linearGradient>
            </defs>
            <rect width="600" height="850" fill="url(#bg-${i})"/>
            <rect x="40" y="40" width="520" height="770" fill="none" stroke="#e2e8f0" stroke-width="2" rx="8"/>
            
            <text x="300" y="120" text-anchor="middle" font-family="serif" font-size="28" font-weight="bold" fill="#1e293b">
              КАТАЛОГ ПАНЕЛЕЙ
            </text>
            <text x="300" y="160" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#64748b">
              Страница ${pageNum} из ${16}
            </text>
            
            <circle cx="300" cy="400" r="60" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="2"/>
            <text x="300" y="420" text-anchor="middle" font-family="sans-serif" font-size="48" font-weight="bold" fill="#334155">
              ${pageNum}
            </text>
            
            <rect x="100" y="500" width="400" height="200" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1" rx="8"/>
            <text x="300" y="540" text-anchor="middle" font-family="sans-serif" font-size="16" fill="#475569">
              Демонстрационная страница
            </text>
            <text x="300" y="570" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#6b7280">
              • Высокое качество материалов
            </text>
            <text x="300" y="600" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#6b7280">
              • Современные технологии
            </text>
            <text x="300" y="630" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#6b7280">
              • Долговечность и надежность
            </text>
            <text x="300" y="660" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#6b7280">
              • Экологичность материалов
            </text>
            
            <text x="300" y="820" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#9ca3af">
              www.marmarill.kz • Каталог продукции
            </text>
          </svg>
        `)}`;
      });

      // Показываем первые 8 страниц сразу
      const initialPages = demoPages.slice(0, 8);
      setPages(initialPages);
      setProgress(70);
      setLoading(false);
      setBackgroundLoading(true);

      // Подгружаем остальные в фоне
      setTimeout(async () => {
        setPages(demoPages);
        setProgress(100);
        setBackgroundLoading(false);
        
        // Пробуем сохранить демо в кеш
        await CacheUtils.save(demoPages);
      }, 1000);

    } catch (error) {
      console.error('🚨 Критическая ошибка:', error);
      setProgress(100);
      setLoading(false);
      setBackgroundLoading(false);
    }
    
    loadingRef.current = false;
  }, []);

  // НОВАЯ ФУНКЦИЯ: Загрузка остальных страниц в фоне
  const loadRemainingPages = useCallback(async (cachedPages: string[]) => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    try {
      console.log('🔄 Запуск фоновой загрузки остальных страниц...');
      
      const pdfSources = [
        '/FlipbookViewer.pdf',
        '/pdf/catalog.pdf',
        'https://marmarill.kz/FlipbookViewer.pdf'
      ];

      for (const source of pdfSources) {
        try {
          console.log(`📖 Фоновая загрузка полного PDF: ${source}`);
          
          const loadedPages = await PDFLoader.loadPDFWithProgressiveLoading(
            source,
            (loaded, total) => {
              // Показываем прогресс фоновой загрузки
              const ratio = Math.min(loaded / total, 1);
              const backgroundProgress = 50 + ratio * 50; // от 50% до 100%
              setProgress(backgroundProgress);
              
              // Обновляем ожидаемое количество страниц
              if (total > totalExpectedPages) {
                setTotalExpectedPages(total);
              }
            },
            (partialPages) => {
              // По мере загрузки добавляем новые страницы
              if (partialPages.length > cachedPages.length) {
                console.log(`📄 Добавлено ${partialPages.length - cachedPages.length} новых страниц`);
                setPages([...partialPages]);
              }
            },
            { scale: 2.0 }
          );

          if (loadedPages && loadedPages.length > 0) {
            console.log(`✅ Полная загрузка завершена: ${loadedPages.length} страниц`);
            setPages(loadedPages);
            setProgress(100);
            setBackgroundLoading(false);
            setTotalExpectedPages(loadedPages.length);
            
            // Обновляем кеш с полными данными
            console.log('💾 Обновление кеша полными данными...');
            await CacheUtils.save(loadedPages);
            
            loadingRef.current = false;
            return;
          }
        } catch (error) {
          console.warn(`❌ Ошибка фоновой загрузки ${source}:`, error);
          continue;
        }
      }

      // Если PDF не загрузился, создаем расширенный демо-контент
      console.log('📚 Создаем расширенный демо-контент...');
      const totalDemoPages = Math.max(totalExpectedPages, 24); // Минимум 24 страницы
      
      const allDemoPages = Array.from({ length: totalDemoPages }, (_, i) => {
        const pageNum = i + 1;
        const isNewPage = i >= cachedPages.length;
        
        return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
          <svg width="600" height="850" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bg-${i}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#f8fafc;stop-opacity:1" />
              </linearGradient>
            </defs>
            <rect width="600" height="850" fill="url(#bg-${i})"/>
            <rect x="40" y="40" width="520" height="770" fill="none" stroke="#e2e8f0" stroke-width="2" rx="8"/>
            
            <text x="300" y="120" text-anchor="middle" font-family="serif" font-size="28" font-weight="bold" fill="#1e293b">
              КАТАЛОГ ПАНЕЛЕЙ
            </text>
            <text x="300" y="160" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#64748b">
              Страница ${pageNum} из ${totalDemoPages}${isNewPage ? ' • Новая' : ' • Из кеша'}
            </text>
            
            <circle cx="300" cy="400" r="60" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="2"/>
            <text x="300" y="420" text-anchor="middle" font-family="sans-serif" font-size="48" font-weight="bold" fill="#334155">
              ${pageNum}
            </text>
            
            <rect x="100" y="500" width="400" height="200" fill="${isNewPage ? '#e0f2fe' : '#f8fafc'}" stroke="#e2e8f0" stroke-width="1" rx="8"/>
            <text x="300" y="540" text-anchor="middle" font-family="sans-serif" font-size="16" fill="#475569">
              ${isNewPage ? 'Новая загруженная страница' : 'Кешированная страница'}
            </text>
            <text x="300" y="570" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#6b7280">
              • Высокое качество материалов
            </text>
            <text x="300" y="600" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#6b7280">
              • Современные технологии
            </text>
            <text x="300" y="630" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#6b7280">
              • Долговечность и надежность
            </text>
            <text x="300" y="660" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#6b7280">
              • Экологичность материалов
            </text>
            
            <text x="300" y="820" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#9ca3af">
              www.marmarill.kz • Каталог продукции
            </text>
          </svg>
        `)}`;
      });

      // Постепенно добавляем новые страницы (имитируем загрузку)
      const cachedCount = cachedPages.length;
      for (let i = cachedCount; i < allDemoPages.length; i += 4) {
        const batch = allDemoPages.slice(0, Math.min(i + 4, allDemoPages.length));
        setPages([...batch]);
        setProgress(50 + ((i - cachedCount) / (allDemoPages.length - cachedCount)) * 50);
        
        // Пауза между батчами для плавности
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      setPages(allDemoPages);
      setProgress(100);
      setBackgroundLoading(false);
      setTotalExpectedPages(allDemoPages.length);
      
      // Сохраняем расширенный демо-контент
      await CacheUtils.save(allDemoPages);

    } catch (error) {
      console.error('🚨 Ошибка фоновой загрузки:', error);
      setBackgroundLoading(false);
      setProgress(100);
    }
    
    loadingRef.current = false;
  }, [totalExpectedPages]);

  // Инициализация при монтировании
  useEffect(() => {
    loadPages();
  }, [loadPages]);

  // Функции навигации (без звука)
  const handlePageChange = useCallback((idx: number) => {
    if (idx >= 0 && idx < pages.length && idx !== currentPage) {
      setCurrentPage(idx);
    }
  }, [currentPage, pages.length]);

  const goToPreviousPage = useCallback(() => {
    if (currentPage > 0) {
      handlePageChange(currentPage - 1);
    }
  }, [currentPage, handlePageChange]);

  const goToNextPage = useCallback(() => {
    if (currentPage < pages.length - 1) {
      handlePageChange(currentPage + 1);
    }
  }, [currentPage, pages.length, handlePageChange]);

  const goToPage = useCallback((pageIndex: number) => {
    if (pageIndex >= 0 && pageIndex < pages.length) {
      setCurrentPage(pageIndex);
      setIsGalleryMode(false);
    }
  }, [pages.length]);

  const toggleGalleryMode = useCallback(() => {
    setIsGalleryMode(!isGalleryMode);
  }, [isGalleryMode]);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.log('Ошибка полноэкранного режима:', error);
    }
  }, []);

  const forceStart = useCallback(() => {
    setLoading(false);
    if (pages.length === 0) {
      // Создаем минимальную демо-страницу
      const emergencyPage = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
        <svg width="600" height="850" xmlns="http://www.w3.org/2000/svg">
          <rect width="600" height="850" fill="white"/>
          <text x="300" y="400" text-anchor="middle" font-size="24" fill="black">Каталог загружается...</text>
        </svg>
      `)}`;
      setPages([emergencyPage]);
    }
  }, [pages.length]);

  // Обработчик клавиш
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isGalleryMode && e.key === 'Escape') {
        setIsGalleryMode(false);
        return;
      }
      
      switch (e.key) {
        case 'ArrowLeft':
          goToPreviousPage();
          break;
        case 'ArrowRight':
          goToNextPage();
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
        case 'g':
        case 'G':
          toggleGalleryMode();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isGalleryMode, goToPreviousPage, goToNextPage, toggleFullscreen, toggleGalleryMode]);

  if (loading) {
    return <LoadingScreen progress={progress} onForceStart={forceStart} />;
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-linear-to-br from-slate-900 via-slate-800 to-black">
      {/* Индикатор фоновой загрузки - УЛУЧШЕННЫЙ */}
      {backgroundLoading && (
        <div className="absolute top-4 right-4 bg-black/80 text-white/90 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3 backdrop-blur-md border border-white/20 shadow-2xl z-40 min-w-[200px]">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white/70 rounded-full animate-spin flex-shrink-0" />
          <div className="flex flex-col gap-1">
            <span className="text-white font-semibold">
              Загружено {pages.length}{totalExpectedPages > 0 ? ` из ${totalExpectedPages}` : ''}
            </span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-400 to-green-400 rounded-full transition-all duration-500 ease-out"
                  style={{ 
                    width: `${totalExpectedPages > 0 ? Math.min((pages.length / totalExpectedPages) * 100, 100) : Math.round(progress)}%` 
                  }}
                />
              </div>
              <span className="text-white/70 text-xs">
                {totalExpectedPages > 0 
                  ? `${Math.round((pages.length / totalExpectedPages) * 100)}%`
                  : `${Math.round(progress)}%`
                }
              </span>
            </div>
          </div>
        </div>
      )}
      
      {/* Основной контейнер - ИСПРАВЛЕНО для идеального центрирования */}
      <div className="relative w-full h-full" style={{ zIndex: 10 }}>
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
      {!isGalleryMode && (
        <BookControls
          currentPage={currentPage}
          totalPages={pages.length}
          soundEnabled={false} // Звук отключен
          isFullscreen={isFullscreen}
          showControls={showControls}
          onPrevPage={goToPreviousPage}
          onNextPage={goToNextPage}
          onToggleSound={() => {}} // Пустая функция
          onToggleFullscreen={toggleFullscreen}
          onToggleGallery={toggleGalleryMode}
          galleryAvailable={true}
          isMobile={isMobile}
        />
      )}
    </div>
  );
}