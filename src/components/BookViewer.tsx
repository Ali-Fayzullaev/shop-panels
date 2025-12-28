'use client';

import React, { useEffect, useRef, useState } from 'react';
import { PageFlip } from 'page-flip';

interface BookViewerProps {
  pages: string[];
  currentPage: number;
  onPageChange: (page: number) => void;
  headerReady?: boolean; // ДОБАВЛЕНО: флаг готовности Header
}

export default function BookViewer({ 
  pages, 
  currentPage, 
  onPageChange,
  headerReady = true // ДОБАВЛЕНО: по умолчанию true для обратной совместимости
}: BookViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bookInstanceRef = useRef<PageFlip | null>(null);
  
  // Состояние для перерисовки при ресайзе
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, isMobile: false });

  // 1. Вычисляем размеры книги при загрузке и ресайзе - ИСПРАВЛЕНО
  useEffect(() => {
    // ИСПРАВЛЕНО: Не рассчитываем размеры, пока Header не готов
    if (!headerReady) {
      return;
    }

    const calculateDimensions = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = width < 768;

      // ИСПРАВЛЕНО: Получаем реальную высоту Header'а
      const headerElement = document.querySelector('header');
      const headerHeight = headerElement ? headerElement.offsetHeight : 80; // fallback 80px

      // ИСПРАВЛЕНО: Правильные отступы с учетом Header'а
      const paddingX = isMobile ? 20 : 80;
      const paddingY = isMobile ? 80 : 100; // Базовый отступ для контролов
      
      // ИСПРАВЛЕНО: Вычитаем высоту Header'а из доступной высоты
      const availableWidth = width - paddingX;
      const availableHeight = height - headerHeight - paddingY;

      // Пропорции книги (A4)
      const pageAspectRatio = 0.707; // Ширина одной страницы / Высота
      
      let bookWidth, bookHeight;

      if (isMobile) {
        // Мобилка: Одна страница
        if (availableWidth / availableHeight > pageAspectRatio) {
          bookHeight = Math.min(availableHeight, 500); // Уменьшили максимум для мобилки
          bookWidth = bookHeight * pageAspectRatio;
        } else {
          bookWidth = Math.min(availableWidth, 350); // Уменьшили максимум для мобилки
          bookHeight = bookWidth / pageAspectRatio;
        }
      } else {
        // Десктоп: Разворот (Две страницы)
        const spreadAspectRatio = pageAspectRatio * 2; 
        
        if (availableWidth / availableHeight > spreadAspectRatio) {
          bookHeight = Math.min(availableHeight, 550); // Уменьшили максимум
          bookWidth = bookHeight * spreadAspectRatio;
        } else {
          bookWidth = Math.min(availableWidth, 800); // Уменьшили максимум
          bookHeight = bookWidth / spreadAspectRatio;
        }
      }

      // Убеждаемся, что размеры не слишком маленькие
      if (isMobile) {
        bookWidth = Math.max(bookWidth, 250);
        bookHeight = Math.max(bookHeight, 330);
      } else {
        bookWidth = Math.max(bookWidth, 500);
        bookHeight = Math.max(bookHeight, 350);
      }

      console.log(`📏 BookViewer размеры: ${Math.round(bookWidth)}x${Math.round(bookHeight)}, Header: ${headerHeight}px, доступно: ${Math.round(availableHeight)}px`);

      setDimensions({ 
        width: Math.round(bookWidth), 
        height: Math.round(bookHeight),
        isMobile 
      });
    };

    // ИСПРАВЛЕНО: Небольшая задержка для стабильности расчетов
    const timer = setTimeout(calculateDimensions, 50);

    window.addEventListener('resize', calculateDimensions);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculateDimensions);
    };
  }, [headerReady]); // ИСПРАВЛЕНО: Пересчитываем при изменении headerReady

  // 2. Инициализация PageFlip - ИСПРАВЛЕНО
  useEffect(() => {
    // ИСПРАВЛЕНО: Не инициализируем, пока Header не готов или размеры не рассчитаны
    if (!headerReady || pages.length === 0 || dimensions.width === 0) {
      return;
    }

    const wrapper = containerRef.current;
    if (!wrapper) return;

    wrapper.innerHTML = ''; // Очистка

    // Создаем контейнер для самой книги
    const bookElement = document.createElement('div');
    wrapper.appendChild(bookElement);

    // Генерируем HTML страниц
    const pageWidth = dimensions.isMobile ? dimensions.width : dimensions.width / 2;
    const pageHeight = dimensions.height;

    pages.forEach((src, index) => {
      const pageDiv = document.createElement('div');
      pageDiv.className = 'page';
      pageDiv.style.cssText = `
        background-color: #fdfbf7;
        background-image: linear-gradient(to right, rgba(0,0,0,0.03) 0%, transparent 5%, transparent 95%, rgba(0,0,0,0.03) 100%);
        border: 1px solid #e2e2e2;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: inset 0 0 30px rgba(0,0,0,0.02);
      `;
      
      // Картинка
      const img = document.createElement('img');
      img.src = src;
      img.draggable = false;
      img.style.cssText = `
        width: 100%;
        height: 100%;
        object-fit: contain;
      `;
      
      // Номер страницы (опционально)
      const num = document.createElement('div');
      num.textContent = (index + 1).toString();
      num.style.cssText = `
        position: absolute;
        bottom: 15px;
        ${index % 2 === 0 ? 'right: 15px;' : 'left: 15px;'}
        font-size: 12px;
        color: #888;
        font-family: sans-serif;
      `;

      pageDiv.appendChild(img);
      // pageDiv.appendChild(num); // Раскомментируйте, если нужны номера
      bookElement.appendChild(pageDiv);
    });

    // Настройка PageFlip
    const pageFlip = new PageFlip(bookElement, {
      width: pageWidth,
      height: pageHeight,
      // На мобильных показываем 1 страницу, на десктопе - разворот
      showCover: true, 
      usePortrait: dimensions.isMobile, 
      mobileScrollSupport: true, 
      maxShadowOpacity: 0.4,
      showPageCorners: true,
      flippingTime: 800,
    });

    pageFlip.loadFromHTML(bookElement.querySelectorAll('.page'));

    pageFlip.on('flip', (e) => {
      onPageChange(e.data as number);
    });

    // Восстанавливаем текущую страницу
    if (currentPage > 0) {
      try {
        pageFlip.flip(currentPage);
      } catch (e) { console.error(e); }
    }

    bookInstanceRef.current = pageFlip;

    console.log(`✅ BookViewer инициализирован: ${pages.length} страниц, размер книги: ${pageWidth}x${pageHeight}`);

    return () => {
      if (bookInstanceRef.current) {
        bookInstanceRef.current.destroy();
      }
    };
  // ИСПРАВЛЕНО: Добавляем headerReady в зависимости
  }, [pages, dimensions.width, dimensions.height, dimensions.isMobile, headerReady]); 

  // Синхронизация внешнего изменения страницы (стрелки)
  useEffect(() => {
    if (bookInstanceRef.current) {
      const currentBookPage = bookInstanceRef.current.getCurrentPageIndex();
      if (currentBookPage !== currentPage) {
        // Проверка, чтобы не флипать, если мы уже там (важно для разворотов)
        try {
            bookInstanceRef.current.flip(currentPage);
        } catch(e) {}
      }
    }
  }, [currentPage]);

  return (
    <div 
      className="w-full h-full flex items-center justify-center p-4"
      style={{
        // ИСПРАВЛЕНО: Правильное позиционирование с учетом Header'а
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
        // ДОБАВЛЕНО: Учитываем Header в позиционировании
        paddingTop: '60px' // Примерная высота Header'а
      }}
    >
      <div 
        ref={containerRef} 
        className="transition-opacity duration-500"
        style={{
          width: dimensions.width,
          height: dimensions.height,
          // Тень самой книги для реалистичности
          filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.4))',
          // ДОБАВЛЕНО: Гарантируем что контейнер книги тоже по центру
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // ДОБАВЛЕНО: Показываем только когда Header готов
          opacity: headerReady ? 1 : 0
        }}
      />
    </div>
  );
}