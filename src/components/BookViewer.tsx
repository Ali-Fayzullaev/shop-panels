'use client';

import React, { useEffect, useRef, useState } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const bookContainerRef = useRef<HTMLDivElement | null>(null);
  const pageFlipRef = useRef<PageFlip | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (pages.length === 0) return;

    const initializeBook = async () => {
      try {
        console.log('🚀 Инициализация безопасной книги с', pages.length, 'страницами');
        
        // Создаем изолированный контейнер вне React DOM
        if (bookContainerRef.current) {
          bookContainerRef.current.remove();
        }
        
        const bookContainer = document.createElement('div');
        bookContainer.style.cssText = `
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        `;
        
        // Определяем увеличенные размеры для лучшего чтения
        const isMobile = window.innerWidth < 768;
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        
        // Полноэкранные размеры для максимального чтения
        const maxWidth = isMobile 
          ? Math.min(screenWidth - 20, 380) 
          : Math.min(screenWidth - 40, screenWidth * 0.9);
        const maxHeight = isMobile 
          ? Math.min(screenHeight - 180, 500) 
          : Math.min(screenHeight - 120, screenHeight * 0.9);
          
        // Длинные страницы (соотношение как у книги A4)
        const aspectRatio = isMobile ? 0.75 : 0.707; // ширина/высота
        
        let bookWidth, bookHeight;
        if (maxWidth * (1 / aspectRatio) <= maxHeight) {
          // Ограничение по ширине
          bookWidth = maxWidth;
          bookHeight = maxWidth * (1 / aspectRatio);
        } else {
          // Ограничение по высоте
          bookHeight = maxHeight;
          bookWidth = maxHeight * aspectRatio;
        }

        // Создаем страницы
        const pageElements: HTMLElement[] = [];
        for (let i = 0; i < pages.length; i++) {
          const pageDiv = document.createElement('div');
          pageDiv.className = 'page';
          pageDiv.style.cssText = `
            width: ${Math.round(bookWidth)}px;
            height: ${Math.round(bookHeight)}px;
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            border: ${isMobile ? '1px solid #e9ecef' : 'none'};
            box-shadow: ${isMobile ? '0 8px 20px rgba(0,0,0,0.1)' : 'none'};
            border-radius: ${isMobile ? '6px' : '2px'};
            overflow: hidden;
          `;
          
          // Добавляем изображение
          const img = document.createElement('img');
          img.src = pages[i];
          img.alt = `Страница ${i + 1}`;
          img.style.cssText = `
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            user-select: none;
            pointer-events: none;
          `;
          
          // Номер страницы
          const pageNumber = document.createElement('div');
          pageNumber.textContent = (i + 1).toString();
          pageNumber.style.cssText = `
            position: absolute;
            bottom: 15px;
            right: 15px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: bold;
            z-index: 10;
          `;
          
          pageDiv.appendChild(img);
          pageDiv.appendChild(pageNumber);
          bookContainer.appendChild(pageDiv);
          pageElements.push(pageDiv);
        }
        
        // Добавляем в основной контейнер
        if (containerRef.current) {
          containerRef.current.appendChild(bookContainer);
          bookContainerRef.current = bookContainer;
        }
        
        // Небольшая задержка для рендеринга
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Создаем PageFlip с увеличенными размерами
        const pageFlip = new PageFlip(bookContainer, {
          width: Math.round(bookWidth),
          height: Math.round(bookHeight),
          showCover: true,
          maxShadowOpacity: 0.6,
          flippingTime: 800,
          useMouseEvents: true,
          swipeDistance: isMobile ? 30 : 50,
          showPageCorners: true,
          disableFlipByClick: false
        });
        
        // Добавляем обработчики
        pageFlip.on('flip', (e) => {
          const pageNum = typeof e.data === 'number' ? e.data : 0;
          console.log('📖 Переход на страницу:', pageNum + 1);
          onPageChange(pageNum);
        });
        
        pageFlip.on('changeOrientation', (e) => {
          const orientation = typeof e.data === 'string' && 
            (e.data === 'portrait' || e.data === 'landscape') ? e.data : 'portrait';
          onOrientationChange(orientation);
        });
        
        // Загружаем страницы
        pageFlip.loadFromHTML(pageElements);
        pageFlipRef.current = pageFlip;
        setIsReady(true);
        
        console.log('✅ Безопасная книга инициализирована!');
        
      } catch (error) {
        console.error('❌ Ошибка инициализации:', error);
        setError(error instanceof Error ? error.message : 'Неизвестная ошибка');
      }
    };
    
    initializeBook();
    
    // Очистка
    return () => {
      console.log('🧹 Очистка безопасной книги');
      
      if (pageFlipRef.current) {
        try {
          pageFlipRef.current.destroy();
        } catch (error) {
          console.warn('Ошибка при уничтожении PageFlip:', error);
        }
        pageFlipRef.current = null;
      }
      
      if (bookContainerRef.current) {
        try {
          bookContainerRef.current.remove();
        } catch (error) {
          console.warn('Ошибка при удалении контейнера:', error);
        }
        bookContainerRef.current = null;
      }
      
      setIsReady(false);
    };
  }, [pages.length]); // Только изменение количества страниц
  
  // Навигация
  useEffect(() => {
    if (isReady && pageFlipRef.current && currentPage >= 0) {
      try {
        pageFlipRef.current.flip(currentPage);
      } catch (error) {
        console.error('Ошибка навигации:', error);
      }
    }
  }, [currentPage, isReady]);
  
  if (error) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fee2e2',
        borderRadius: '12px',
        border: '2px solid #fecaca'
      }}>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>❌</div>
          <h3 style={{ color: '#dc2626', marginBottom: '10px' }}>Ошибка загрузки книги</h3>
          <p style={{ color: '#991b1b', fontSize: '14px' }}>{error}</p>
        </div>
      </div>
    );
  }
  
  if (pages.length === 0) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>📚</div>
          <div style={{ fontSize: '18px', color: '#666' }}>Загрузка страниц...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }}>
      <div 
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      />

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}