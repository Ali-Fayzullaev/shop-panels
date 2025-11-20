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
        
        // Создаем страницы
        const pageElements: HTMLElement[] = [];
        for (let i = 0; i < pages.length; i++) {
          const pageDiv = document.createElement('div');
          pageDiv.className = 'page';
          pageDiv.style.cssText = `
            width: 400px;
            height: 600px;
            background: white;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            border: 1px solid #ddd;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            border-radius: 8px;
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
        
        // Создаем PageFlip
        const pageFlip = new PageFlip(bookContainer, {
          width: 400,
          height: 600,
          showCover: true,
          maxShadowOpacity: 0.4,
          flippingTime: 600,
          useMouseEvents: true,
          swipeDistance: 30,
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
        height: '600px',
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
        height: '600px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: '12px'
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
      height: '600px',
      position: 'relative',
      backgroundColor: '#f8f9fa',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
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
      
      {!isReady && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          background: 'rgba(255,255,255,0.95)',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #e3e3e3',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <p style={{ fontSize: '18px', fontWeight: '600', color: '#374151' }}>
            ⚙️ Инициализация безопасной книги...
          </p>
        </div>
      )}
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}