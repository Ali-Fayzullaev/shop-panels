'use client';

import React, { useEffect, useRef } from 'react';
import { PageFlip } from 'page-flip';

interface UltraSafeBookViewerProps {
  pages: string[];
  currentPage: number;
  onPageChange: (page: number) => void;
  onOrientationChange: (orientation: 'portrait' | 'landscape') => void;
}

export default function UltraSafeBookViewer({ 
  pages, 
  currentPage, 
  onPageChange, 
  onOrientationChange 
}: UltraSafeBookViewerProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(false);
  const pageFlipRef = useRef<PageFlip | null>(null);
  const bookDataRef = useRef<{
    container: HTMLDivElement | null;
    isInitialized: boolean;
  }>({
    container: null,
    isInitialized: false
  });

  useEffect(() => {
    if (mountedRef.current || pages.length === 0 || !wrapperRef.current) return;
    
    mountedRef.current = true;

    const initializeBook = () => {
      console.log('🚀 Ultra Safe Book - инициализация с', pages.length, 'страницами');

      // Создаем абсолютно отделенный контейнер
      const shadowContainer = document.createElement('div');
      shadowContainer.className = 'ultra-safe-book-container';
      shadowContainer.style.cssText = `
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        background: transparent;
      `;

      // Создаем страницы напрямую в DOM
      const pageElements: HTMLDivElement[] = [];
      
      pages.forEach((pageSrc, index) => {
        const pageDiv = document.createElement('div');
        pageDiv.className = 'page';
        pageDiv.setAttribute('data-page-number', String(index));
        
        pageDiv.style.cssText = `
          width: 400px;
          height: 600px;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15), 0 4px 6px rgba(0,0,0,0.05);
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.2s ease;
        `;

        // Изображение страницы
        const img = document.createElement('img');
        img.src = pageSrc;
        img.alt = `Страница ${index + 1}`;
        img.style.cssText = `
          max-width: 95%;
          max-height: 95%;
          object-fit: contain;
          user-select: none;
          pointer-events: none;
          border-radius: 8px;
        `;

        // Номер страницы
        const pageNum = document.createElement('div');
        pageNum.textContent = String(index + 1);
        pageNum.style.cssText = `
          position: absolute;
          bottom: 12px;
          right: 12px;
          background: linear-gradient(135deg, rgba(0,0,0,0.8), rgba(0,0,0,0.9));
          color: white;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          z-index: 10;
          backdrop-filter: blur(4px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        `;

        pageDiv.appendChild(img);
        pageDiv.appendChild(pageNum);
        shadowContainer.appendChild(pageDiv);
        pageElements.push(pageDiv);
      });

      // Прикрепляем к обертке
      if (wrapperRef.current) {
        wrapperRef.current.innerHTML = '';
        wrapperRef.current.appendChild(shadowContainer);
        bookDataRef.current.container = shadowContainer;
      }

      // Инициализация PageFlip с задержкой
      setTimeout(() => {
        try {
          if (!shadowContainer.parentElement) {
            console.warn('Контейнер был удален, прерываем инициализацию');
            return;
          }

          const pageFlip = new PageFlip(shadowContainer, {
            width: 400,
            height: 600,
            showCover: true,
            maxShadowOpacity: 0.3,
            flippingTime: 800,
            useMouseEvents: true,
            swipeDistance: 30,
            showPageCorners: true,
            disableFlipByClick: false,
            autoSize: false,
            size: 'fixed',
            minWidth: 400,
            maxWidth: 400,
            minHeight: 600,
            maxHeight: 600
          });

          // События
          pageFlip.on('flip', (e) => {
            const pageNum = typeof e.data === 'number' ? e.data : 0;
            console.log('📖 Ultra Safe - переход на страницу:', pageNum + 1);
            onPageChange(pageNum);
          });

          pageFlip.on('changeOrientation', (e) => {
            const orientation = (typeof e.data === 'string' && 
              (e.data === 'portrait' || e.data === 'landscape')) ? e.data : 'portrait';
            onOrientationChange(orientation);
          });

          // Загружаем страницы
          pageFlip.loadFromHTML(pageElements);
          pageFlipRef.current = pageFlip;
          bookDataRef.current.isInitialized = true;

          console.log('✅ Ultra Safe Book инициализирована успешно!');
          
        } catch (error) {
          console.error('❌ Ошибка Ultra Safe инициализации:', error);
        }
      }, 500);
    };

    initializeBook();

    // Функция очистки
    return () => {
      console.log('🧹 Ultra Safe cleanup');
      mountedRef.current = false;
      
      // Уничтожаем PageFlip
      if (pageFlipRef.current) {
        try {
          pageFlipRef.current.destroy();
          pageFlipRef.current = null;
        } catch (error) {
          console.warn('Предупреждение при очистке PageFlip:', error);
        }
      }

      // Очищаем контейнер с защитой
      if (bookDataRef.current.container) {
        try {
          // Проверяем что элемент еще существует и имеет родителя
          if (bookDataRef.current.container.parentElement) {
            bookDataRef.current.container.parentElement.removeChild(bookDataRef.current.container);
          }
        } catch (error) {
          console.warn('Предупреждение при очистке контейнера:', error);
        }
        bookDataRef.current.container = null;
        bookDataRef.current.isInitialized = false;
      }

      // Очищаем wrapper безопасно
      if (wrapperRef.current) {
        try {
          // Небольшая задержка чтобы избежать race condition
          setTimeout(() => {
            if (wrapperRef.current && !mountedRef.current) {
              wrapperRef.current.innerHTML = '';
            }
          }, 50);
        } catch (error) {
          console.warn('Предупреждение при очистке wrapper:', error);
        }
      }
    };
  }, [pages.length]); // Только количество страниц

  // Навигация
  useEffect(() => {
    if (bookDataRef.current.isInitialized && pageFlipRef.current && currentPage >= 0) {
      try {
        pageFlipRef.current.flip(currentPage);
      } catch (error) {
        console.warn('Предупреждение при навигации:', error);
      }
    }
  }, [currentPage]);

  if (pages.length === 0) {
    return (
      <div style={{
        width: '100%',
        height: '600px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        borderRadius: '16px',
        border: '2px dashed #cbd5e1'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px', opacity: 0.7 }}>📚</div>
          <div style={{ fontSize: '20px', color: '#64748b', fontWeight: '600' }}>
            Ожидание загрузки страниц...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      width: '100%',
      height: '600px',
      background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
      borderRadius: '20px',
      padding: '20px',
      boxShadow: '0 25px 50px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.3)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Декоративные элементы */}
      <div style={{
        position: 'absolute',
        top: '-50px',
        right: '-50px',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)',
        borderRadius: '50%'
      }} />
      
      <div 
        ref={wrapperRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1
        }}
      />

      {/* Индикатор состояния */}
      {!bookDataRef.current.isInitialized && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(255,255,255,0.95)',
          padding: '30px',
          borderRadius: '16px',
          textAlign: 'center',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)',
          zIndex: 10
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid #f1f5f9',
            borderTop: '4px solid #6366f1',
            borderRadius: '50%',
            animation: 'spin 1.2s linear infinite',
            margin: '0 auto 20px'
          }} />
          <div style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '8px'
          }}>
            🔥 Ultra Safe инициализация
          </div>
          <div style={{
            fontSize: '14px',
            color: '#6b7280'
          }}>
            Защищенная от конфликтов версия
          </div>
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