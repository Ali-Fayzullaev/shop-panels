'use client';

import React, { useEffect, useRef, useState } from 'react';
import { PageFlip } from 'page-flip';

interface SimpleBookViewerProps {
  pages: string[];
}

export default function SimpleBookViewer({ pages }: SimpleBookViewerProps) {
  const bookRef = useRef<HTMLDivElement>(null);
  const pageFlipRef = useRef<PageFlip | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    if (!bookRef.current || pages.length === 0) return;

    console.log('🚀 Инициализация простой книги с', pages.length, 'страницами');

    // Очищаем контейнер
    bookRef.current.innerHTML = '';

    // Создаем страницы
    pages.forEach((pageSrc, index) => {
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
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      `;
      
      const img = document.createElement('img');
      img.src = pageSrc;
      img.alt = `Страница ${index + 1}`;
      img.style.cssText = `
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      `;
      
      const pageNumber = document.createElement('div');
      pageNumber.textContent = (index + 1).toString();
      pageNumber.style.cssText = `
        position: absolute;
        bottom: 10px;
        right: 10px;
        background: #333;
        color: white;
        padding: 5px 10px;
        border-radius: 5px;
        font-size: 14px;
        font-weight: bold;
      `;
      
      pageDiv.appendChild(img);
      pageDiv.appendChild(pageNumber);
      bookRef.current!.appendChild(pageDiv);
    });

    // Создаем PageFlip
    setTimeout(() => {
      try {
        const pageFlip = new PageFlip(bookRef.current!, {
          width: 400,
          height: 600,
          showCover: true,
          maxShadowOpacity: 0.5
        });

        pageFlip.on('flip', (e) => {
          const pageNum = typeof e.data === 'number' ? e.data : 0;
          setCurrentPage(pageNum);
          console.log('📖 Страница:', pageNum + 1);
        });

        const pageElements = bookRef.current!.querySelectorAll('.page');
        pageFlip.loadFromHTML(pageElements as NodeListOf<HTMLElement>);
        
        pageFlipRef.current = pageFlip;
        setIsReady(true);
        
        console.log('✅ Простая книга инициализирована успешно!');
        
      } catch (error) {
        console.error('❌ Ошибка инициализации:', error);
      }
    }, 500);

    return () => {
      if (pageFlipRef.current) {
        try {
          pageFlipRef.current.destroy();
        } catch (error) {
          console.error('Ошибка при уничтожении:', error);
        }
      }
    };
  }, [pages]);

  if (pages.length === 0) {
    return (
      <div style={{ 
        width: '400px', 
        height: '600px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#f5f5f5',
        borderRadius: '10px',
        margin: '0 auto'
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
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      gap: '20px',
      padding: '20px'
    }}>
      <div 
        ref={bookRef}
        style={{
          position: 'relative',
          minHeight: '600px',
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
          background: 'rgba(255,255,255,0.9)',
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <div>⚙️ Инициализация книги...</div>
        </div>
      )}
      
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        alignItems: 'center',
        background: '#f8f9fa',
        padding: '10px 20px',
        borderRadius: '25px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <button 
          onClick={() => pageFlipRef.current?.flipPrev()}
          style={{
            padding: '8px 16px',
            background: '#6366f1',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          ← Назад
        </button>
        
        <span style={{ 
          fontSize: '16px', 
          fontWeight: 'bold',
          minWidth: '120px',
          textAlign: 'center'
        }}>
          {currentPage + 1} из {pages.length}
        </span>
        
        <button 
          onClick={() => pageFlipRef.current?.flipNext()}
          style={{
            padding: '8px 16px',
            background: '#6366f1',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Вперед →
        </button>
      </div>
    </div>
  );
}