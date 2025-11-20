'use client';

import React, { useEffect, useState, useRef } from 'react';
import BookViewer from '@/components/BookViewer';
import { PDFLoader } from '@/lib/pdfLoader';

export default function BookPage() {
  const [pages, setPages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Инициализация аудио
  useEffect(() => {
    audioRef.current = new Audio('/sounds/flip.mp3');
    audioRef.current.volume = 0.3;
    audioRef.current.preload = 'auto';
  }, []);

  // Отслеживание размера экрана
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Автоскрытие контролов
  useEffect(() => {
    const resetControlsTimer = () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      
      setShowControls(true);
      
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };

    const handleMouseMove = () => resetControlsTimer();
    const handleTouch = () => resetControlsTimer();

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchstart', handleTouch);
    
    resetControlsTimer();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchstart', handleTouch);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const loadPDF = async () => {
      try {
        const pdfPages = await PDFLoader.loadPDFWithProgress(
          '/FlipbookViewer.pdf',
          (loaded, total) => {
            const progressPercent = (loaded / total) * 100;
            setProgress(progressPercent);
          },
          {
            scale: 2.5,
            quality: 0.95
          }
        );
        
        setPages(pdfPages);
        setLoading(false);
        
      } catch (error) {
        // Fallback на демо страницы с увеличенными размерами
        const demoPages = Array.from({ length: 8 }, (_, i) => 
          `data:image/svg+xml;base64,${btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" width="600" height="850" viewBox="0 0 600 850">
              <defs>
                <linearGradient id="grad${i}" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
                </linearGradient>
                <filter id="shadow${i}">
                  <feDropShadow dx="3" dy="6" stdDeviation="8" flood-opacity="0.3"/>
                </filter>
              </defs>
              <rect width="600" height="850" fill="url(#grad${i})" rx="20" filter="url(#shadow${i})"/>
              
              <!-- Декоративные элементы -->
              <circle cx="300" cy="200" r="100" fill="rgba(255,255,255,0.1)"/>
              <circle cx="300" cy="200" r="60" fill="rgba(255,255,255,0.05)"/>
              
              <!-- Заголовок -->
              <text x="300" y="150" text-anchor="middle" font-family="serif" font-size="36" font-weight="bold" fill="white">
                КАТАЛОГ
              </text>
              <text x="300" y="185" text-anchor="middle" font-family="serif" font-size="18" fill="rgba(255,255,255,0.9)">
                Стеновые панели премиум качества
              </text>
              
              <!-- Номер страницы -->
              <text x="300" y="280" text-anchor="middle" font-family="sans-serif" font-size="80" font-weight="bold" fill="white">
                ${i + 1}
              </text>
              
              <!-- Описание -->
              <text x="300" y="450" text-anchor="middle" font-family="sans-serif" font-size="16" fill="rgba(255,255,255,0.8)">
                Современные решения для вашего интерьера
              </text>
              <text x="300" y="480" text-anchor="middle" font-family="sans-serif" font-size="14" fill="rgba(255,255,255,0.7)">
                Высокое качество • Стильный дизайн • Долговечность
              </text>
              
              <!-- Декоративные линии -->
              <line x1="150" y1="520" x2="450" y2="520" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
              <line x1="200" y1="540" x2="400" y2="540" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
              
              <!-- Номер страницы внизу -->
              <text x="300" y="780" text-anchor="middle" font-family="sans-serif" font-size="20" fill="rgba(255,255,255,0.6)">
                Страница ${i + 1}
              </text>
            </svg>
          `)}`
        );
        
        setPages(demoPages);
        setLoading(false);
      }
    };
    
    loadPDF();
  }, []);

  // Функция воспроизведения звука
  const playFlipSound = () => {
    if (audioRef.current) {
      try {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      } catch (error) {}
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    playFlipSound();
  };

  // Навигация
  const goToPreviousPage = () => {
    if (currentPage > 0) {
      handlePageChange(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < pages.length - 1) {
      handlePageChange(currentPage + 1);
    }
  };

  const goToFirstPage = () => {
    handlePageChange(0);
  };

  const goToLastPage = () => {
    handlePageChange(pages.length - 1);
  };

  // Полноэкранный режим
  const toggleFullscreen = async () => {
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
  };

  // Отслеживание изменений полноэкранного режима
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Клавиатурные сокращения
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          goToPreviousPage();
          break;
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
          event.preventDefault();
          goToNextPage();
          break;
        case 'Home':
          event.preventDefault();
          goToFirstPage();
          break;
        case 'End':
          event.preventDefault();
          goToLastPage();
          break;
        case 'f':
        case 'F11':
          event.preventDefault();
          toggleFullscreen();
          break;
        case 'Escape':
          if (document.fullscreenElement) {
            event.preventDefault();
            toggleFullscreen();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, pages.length]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          padding: '40px',
          borderRadius: '20px',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          maxWidth: '400px',
          width: '100%'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            border: '6px solid #f3f3f3',
            borderTop: '6px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 30px'
          }} />
          
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            marginBottom: '15px',
            color: '#333'
          }}>
             Загрузка каталога
          </h2>
          
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#f0f0f0',
            borderRadius: '4px',
            overflow: 'hidden',
            marginBottom: '15px'
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              background: '#33333333',
              borderRadius: '4px',
              transition: 'width 0.3s ease'
            }} />
          </div>
          
          <p style={{ 
            fontSize: '16px', 
            color: '#666',
            margin: '0'
          }}>
            Прогресс: {Math.round(progress)}%
          </p>
          
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Основной контент */}
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? '5px' : '10px'
      }}>
        <BookViewer
          pages={pages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onOrientationChange={(orientation) => {
            console.log('🔄 Ориентация:', orientation);
          }}
        />
      </div>

      {/* Нижняя панель навигации */}
      <div style={{
        position: 'absolute',
        bottom: '0',
        left: '0',
        right: '0',
        height: isMobile ? '80px' : '100px',
        background: 'linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, transparent 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 0px',
        opacity: showControls ? 1 : 0,
        transition: 'opacity 0.3s ease',
        zIndex: 100
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? '8px' : '15px',
          background: 'rgba(0,0,0,0.5)',
          borderRadius: '50px',
          padding: isMobile ? '8px 12px' : '12px 20px',
          backdropFilter: 'blur(10px)'
        }}>
          {/* Кнопка к первой странице */}
          {!isMobile && (
            <button
              onClick={goToFirstPage}
              disabled={currentPage === 0}
              style={{
                background: currentPage === 0 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                color: currentPage === 0 ? 'rgba(255,255,255,0.4)' : 'white',
                cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (currentPage !== 0) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== 0) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                }
              }}
            >
              ⏪
            </button>
          )}

          {/* Кнопка предыдущей страницы */}
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 0}
            style={{
              background: currentPage === 0 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '50%',
              width: isMobile ? '45px' : '50px',
              height: isMobile ? '45px' : '50px',
              color: currentPage === 0 ? 'rgba(255,255,255,0.4)' : 'white',
              cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
              fontSize: isMobile ? '18px' : '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (currentPage !== 0) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                e.currentTarget.style.transform = 'scale(1.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== 0) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          >
            ◀
          </button>

          {/* Индикатор страниц */}
          <div style={{
            color: 'white',
            fontWeight: '600',
            fontSize: isMobile ? '14px' : '16px',
            minWidth: isMobile ? '60px' : '80px',
            textAlign: 'center',
            padding: '0 10px'
          }}>
            {currentPage + 1} / {pages.length}
          </div>

          {/* Кнопка следующей страницы */}
          <button
            onClick={goToNextPage}
            disabled={currentPage === pages.length - 1}
            style={{
              background: currentPage === pages.length - 1 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '50%',
              width: isMobile ? '45px' : '50px',
              height: isMobile ? '45px' : '50px',
              color: currentPage === pages.length - 1 ? 'rgba(255,255,255,0.4)' : 'white',
              cursor: currentPage === pages.length - 1 ? 'not-allowed' : 'pointer',
              fontSize: isMobile ? '18px' : '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (currentPage !== pages.length - 1) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                e.currentTarget.style.transform = 'scale(1.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== pages.length - 1) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          >
            ▶
          </button>

          {/* Кнопка к последней странице */}
          {!isMobile && (
            <button
              onClick={goToLastPage}
              disabled={currentPage === pages.length - 1}
              style={{
                background: currentPage === pages.length - 1 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                color: currentPage === pages.length - 1 ? 'rgba(255,255,255,0.4)' : 'white',
                cursor: currentPage === pages.length - 1 ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (currentPage !== pages.length - 1) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== pages.length - 1) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                }
              }}
            >
              ⏩
            </button>
          )}
        </div>
      </div>

      {/* Мобильные боковые кнопки */}
      {isMobile && (
        <>
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 0}
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: currentPage === 0 ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.6)',
              border: 'none',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              color: currentPage === 0 ? 'rgba(255,255,255,0.4)' : 'white',
              cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
              fontSize: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 50,
              opacity: showControls ? 1 : 0,
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(5px)'
            }}
          >
            ◀
          </button>

          <button
            onClick={goToNextPage}
            disabled={currentPage === pages.length - 1}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: currentPage === pages.length - 1 ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.6)',
              border: 'none',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              color: currentPage === pages.length - 1 ? 'rgba(255,255,255,0.4)' : 'white',
              cursor: currentPage === pages.length - 1 ? 'not-allowed' : 'pointer',
              fontSize: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 50,
              opacity: showControls ? 1 : 0,
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(5px)'
            }}
          >
            ▶
          </button>
        </>
      )}
    </div>
  );
}