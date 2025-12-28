'use client';

import React, { useEffect, useRef, useState } from 'react';
import { PageFlip } from 'page-flip';

interface BookViewerProps {
  pages: string[];
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function BookViewer({ 
  pages, 
  currentPage, 
  onPageChange, 
}: BookViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bookInstanceRef = useRef<PageFlip | null>(null);
  
  // Состояние для перерисовки при ресайзе
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, isMobile: false });

  // 1. Вычисляем размеры книги при загрузке и ресайзе
  useEffect(() => {
    const calculateDimensions = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = width < 768;

      // ИСПРАВЛЕНО: Увеличиваем отступы для лучшего центрирования
      const paddingX = isMobile ? 20 : 80; // Уменьшенные боковые отступы
      const paddingY = isMobile ? 120 : 140; // Увеличенные отступы сверху/снизу для контролов

      const availableWidth = width - paddingX;
      const availableHeight = height - paddingY;

      // Пропорции книги (A4)
      const pageAspectRatio = 0.707; // Ширина одной страницы / Высота
      
      let bookWidth, bookHeight;

      if (isMobile) {
        // Мобилка: Одна страница
        if (availableWidth / availableHeight > pageAspectRatio) {
          bookHeight = Math.min(availableHeight, 550); // Чуть меньше максимум
          bookWidth = bookHeight * pageAspectRatio;
        } else {
          bookWidth = Math.min(availableWidth, 380); // Чуть меньше максимум
          bookHeight = bookWidth / pageAspectRatio;
        }
      } else {
        // Десктоп: Разворот (Две страницы)
        const spreadAspectRatio = pageAspectRatio * 2; 
        
        if (availableWidth / availableHeight > spreadAspectRatio) {
          bookHeight = Math.min(availableHeight, 600); // Уменьшенная максимальная высота
          bookWidth = bookHeight * spreadAspectRatio;
        } else {
          bookWidth = Math.min(availableWidth, 900); // Уменьшенная максимальная ширина
          bookHeight = bookWidth / spreadAspectRatio;
        }
      }

      // Убеждаемся, что размеры не слишком маленькие
      if (isMobile) {
        bookWidth = Math.max(bookWidth, 280);
        bookHeight = Math.max(bookHeight, 380);
      } else {
        bookWidth = Math.max(bookWidth, 560);
        bookHeight = Math.max(bookHeight, 380);
      }

      setDimensions({ 
        width: Math.round(bookWidth), 
        height: Math.round(bookHeight),
        isMobile 
      });
    };

    calculateDimensions();
    window.addEventListener('resize', calculateDimensions);
    return () => window.removeEventListener('resize', calculateDimensions);
  }, []);

  // 2. Инициализация PageFlip
  useEffect(() => {
    if (pages.length === 0 || dimensions.width === 0) return;

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
        object-fit: contain; /* Или cover, если нужно заполнение без полей */
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

    return () => {
      if (bookInstanceRef.current) {
        bookInstanceRef.current.destroy();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pages, dimensions.width, dimensions.height, dimensions.isMobile]); 
  // Пересоздаем книгу только если изменились размеры или ориентация

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
        // ИСПРАВЛЕНО: Убираем любые смещения и гарантируем центрирование
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1
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
          justifyContent: 'center'
        }}
      />
    </div>
  );
}