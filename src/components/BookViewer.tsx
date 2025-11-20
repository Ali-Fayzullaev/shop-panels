'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { PageFlip } from 'page-flip';

interface BookViewerProps {
  pages: string[];
  currentPage: number;
  onPageChange: (page: number) => void;
  onOrientationChange: (orientation: 'portrait' | 'landscape') => void;
}

export default function BookViewer({ 
  pages, 
  currentPage, 
  onPageChange, 
  onOrientationChange 
}: BookViewerProps) {
  const bookRef = useRef<HTMLDivElement>(null);
  const pageFlipRef = useRef<PageFlip | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initializationRef = useRef<boolean>(false);
  const domManagedByPageFlip = useRef<boolean>(false);
  
  console.log('BookViewer render - страниц:', pages.length);

  // Предзагрузка изображений с детальным логированием
  const preloadImages = useCallback(async (imageUrls: string[]): Promise<void> => {
    console.log('Начинаем предзагрузку изображений:', imageUrls.length);
    setIsLoading(true);
    
    const loadPromises = imageUrls.map((url, index) => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        
        img.onload = () => {
          console.log(`✅ Изображение ${index + 1}/${imageUrls.length} загружено:`, url.substring(0, 50) + '...');
          resolve();
        };
        
        img.onerror = (error) => {
          console.error(`❌ Ошибка загрузки изображения ${index + 1}:`, url, error);
          // Не отклоняем промис, чтобы не блокировать другие изображения
          resolve();
        };
        
        img.src = url;
      });
    });

    try {
      await Promise.all(loadPromises);
      console.log('🎉 Все изображения обработаны');
    } catch (error) {
      console.error('Ошибка при загрузке изображений:', error);
    }
  }, []);

  const initializeBook = useCallback(async () => {
    if (!bookRef.current || pages.length === 0 || initializationRef.current) {
      console.log('❌ Инициализация заблокирована:', {
        hasRef: !!bookRef.current,
        pagesLength: pages.length,
        alreadyInitializing: initializationRef.current
      });
      return;
    }

    console.log('🚀 Начинаем инициализацию книги с', pages.length, 'страницами');
    
    initializationRef.current = true;
    setIsLoading(true);
    setIsInitialized(false);
    setError(null);

    try {
      // Уничтожаем предыдущий экземпляр
      if (pageFlipRef.current) {
        console.log('🗑️ Уничтожаем предыдущий PageFlip');
        try {
          pageFlipRef.current.destroy();
        } catch (error) {
          console.warn('⚠️ Ошибка при уничтожении предыдущего PageFlip:', error);
        }
        pageFlipRef.current = null;
      }

      // Безопасно очищаем контейнер только если он не управляется PageFlip
      if (bookRef.current && !domManagedByPageFlip.current) {
        bookRef.current.innerHTML = '';
      }
      domManagedByPageFlip.current = false;
      
      // Предзагружаем все изображения
      await preloadImages(pages);
      
      // Проверяем, что контейнер всё ещё существует
      if (!bookRef.current) {
        throw new Error('Контейнер книги был удален во время загрузки');
      }
      
      console.log('📚 Создаем DOM элементы страниц...');
      
      // Создаем страницы в DOM
      pages.forEach((pageSrc, index) => {
        const pageDiv = document.createElement('div');
        pageDiv.className = 'page';
        pageDiv.setAttribute('data-page', (index + 1).toString());
        
        // Стили для страницы
        pageDiv.style.cssText = `
          width: 100%;
          height: 100%;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          overflow: hidden;
        `;
        
        // Создаем изображение
        const img = document.createElement('img');
        img.src = pageSrc;
        img.alt = `Страница ${index + 1}`;
        img.draggable = false;
        img.style.cssText = `
          max-width: 100%;
          max-height: 100%;
          width: auto;
          height: auto;
          object-fit: contain;
          user-select: none;
        `;
        
        // Добавляем номер страницы
        const pageNumber = document.createElement('div');
        pageNumber.textContent = (index + 1).toString();
        pageNumber.style.cssText = `
          position: absolute;
          bottom: 10px;
          right: 10px;
          background: rgba(0,0,0,0.7);
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: bold;
          z-index: 10;
        `;
        
        pageDiv.appendChild(img);
        pageDiv.appendChild(pageNumber);
        bookRef.current!.appendChild(pageDiv);
      });

      // Небольшая задержка для рендеринга DOM
      await new Promise(resolve => setTimeout(resolve, 300));

      console.log('⚙️ Создаем экземпляр PageFlip...');
      
      // Определяем настройки в зависимости от устройства
      const isMobile = window.innerWidth < 768;
      const bookSettings = {
        width: isMobile ? 350 : 500,
        height: isMobile ? 500 : 700,
        minWidth: 300,
        maxWidth: isMobile ? 400 : 800,
        minHeight: 400,
        maxHeight: isMobile ? 600 : 900,
        maxShadowOpacity: 0.4,
        showCover: true,
        mobileScrollSupport: isMobile,
        swipeDistance: 30,
        clickEventForward: true,
        usePortrait: isMobile,
        startZIndex: 0,
        autoSize: true,
        showPageCorners: true,
        disableFlipByClick: false,
        flippingTime: 800,
        useMouseEvents: !isMobile,
        drawShadow: true
      };

      // Создаем PageFlip
      const pageFlip = new PageFlip(bookRef.current, bookSettings);

      // Добавляем обработчики событий
      pageFlip.on('flip', (e) => {
        const pageNum = typeof e.data === 'number' ? e.data : 0;
        console.log('📖 Переход на страницу:', pageNum + 1);
        onPageChange(pageNum);
      });

      pageFlip.on('changeOrientation', (e) => {
        console.log('🔄 Изменение ориентации:', e.data);
        const orientation = typeof e.data === 'string' && (e.data === 'portrait' || e.data === 'landscape') ? e.data : 'portrait';
        onOrientationChange(orientation);
      });

      pageFlip.on('changeState', (e) => {
        console.log('📊 Изменение состояния PageFlip:', e.data);
      });

      // Получаем все созданные страницы
      const pageElements = bookRef.current.querySelectorAll('.page');
      console.log('📑 Загружаем страницы в PageFlip:', pageElements.length);
      
      if (pageElements.length === 0) {
        throw new Error('Не найдено элементов страниц в DOM');
      }

      // Загружаем страницы в PageFlip
      pageFlip.loadFromHTML(pageElements as NodeListOf<HTMLElement>);
      
      pageFlipRef.current = pageFlip;
      domManagedByPageFlip.current = true; // Отмечаем что DOM теперь управляется PageFlip
      setIsInitialized(true);
      setIsLoading(false);
      
      console.log('🎉 PageFlip успешно инициализирован!');
      
      // Переходим на нужную страницу если указана
      if (currentPage > 0) {
        setTimeout(() => {
          try {
            pageFlip.flip(currentPage);
            console.log('📍 Установлена начальная страница:', currentPage + 1);
          } catch (error) {
            console.error('❌ Ошибка установки начальной страницы:', error);
          }
        }, 500);
      }
      
    } catch (error) {
      console.error('💥 Критическая ошибка инициализации PageFlip:', error);
      setError(error instanceof Error ? error.message : 'Неизвестная ошибка');
      setIsLoading(false);
    } finally {
      initializationRef.current = false;
    }
  }, [pages, preloadImages, onPageChange, onOrientationChange, currentPage]);

  // Основной эффект инициализации - запускается только при изменении количества страниц
  useEffect(() => {
    if (pages.length > 0) {
      console.log('🔄 Запуск инициализации - страниц:', pages.length);
      
      // Небольшая задержка для рендеринга контейнера
      const timer = setTimeout(() => {
        initializeBook();
      }, 100);
      
      return () => {
        clearTimeout(timer);
      };
    } else {
      console.log('⏳ Ожидание страниц...');
      setIsLoading(false);
      setIsInitialized(false);
    }
  }, [pages.length]); // Только длина массива

  // Эффект для навигации по страницам
  useEffect(() => {
    if (isInitialized && pageFlipRef.current && currentPage >= 0) {
      try {
        console.log('🧭 Навигация на страницу:', currentPage + 1);
        pageFlipRef.current.flip(currentPage);
      } catch (error) {
        console.error('❌ Ошибка навигации на страницу:', error);
      }
    }
  }, [currentPage, isInitialized]);

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      console.log('🧹 Размонтирование BookViewer');
      initializationRef.current = false;
      domManagedByPageFlip.current = false;
      
      if (pageFlipRef.current) {
        try {
          // Сначала уничтожаем PageFlip
          pageFlipRef.current.destroy();
          pageFlipRef.current = null;
          
          // Затем безопасно очищаем контейнер
          if (bookRef.current) {
            setTimeout(() => {
              if (bookRef.current && !domManagedByPageFlip.current) {
                bookRef.current.innerHTML = '';
              }
            }, 100);
          }
        } catch (error) {
          console.error('❌ Ошибка при уничтожении PageFlip:', error);
        }
      }
    };
  }, []);

  // Рендер состояния ошибки
  if (error) {
    return (
      <div className="book-container">
        <div 
          style={{
            width: '100%',
            height: '600px',
            margin: '0 auto',
            backgroundColor: '#fee2e2',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #fecaca'
          }}
        >
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>❌</div>
            <h3 style={{ color: '#dc2626', marginBottom: '10px' }}>Ошибка инициализации книги</h3>
            <p style={{ color: '#991b1b', fontSize: '14px' }}>{error}</p>
            <button 
              onClick={() => {
                setError(null);
                initializeBook();
              }}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Попробовать снова
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="book-container">
      <div 
        ref={bookRef} 
        className="book-viewer"
        style={{
          width: '100%',
          height: '600px',
          margin: '0 auto',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Индикатор загрузки */}
        {(isLoading || !isInitialized) && (
          <div 
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              zIndex: 1000,
              background: 'rgba(255,255,255,0.95)',
              padding: '30px',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}
          >
            <div 
              style={{
                width: '50px',
                height: '50px',
                border: '4px solid #e3e3e3',
                borderTop: '4px solid #3b82f6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 20px'
              }}
            />
            <p style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#374151',
              margin: '0 0 10px 0'
            }}>
              {isLoading ? '📖 Загрузка книги...' : '⚙️ Инициализация...'}
            </p>
            <p style={{ 
              fontSize: '14px', 
              color: '#6b7280',
              margin: '0'
            }}>
              Обработано страниц: {pages.length}
            </p>
          </div>
        )}
      </div>
      
      {/* CSS анимации */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}