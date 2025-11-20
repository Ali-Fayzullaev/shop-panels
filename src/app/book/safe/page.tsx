'use client';

import React, { useEffect, useState } from 'react';
import SafeBookViewer from '@/components/SafeBookViewer';
import { PDFLoader } from '@/lib/pdfLoader';

export default function SafeBookPage() {
  const [pages, setPages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const loadPDF = async () => {
      try {
        console.log('🔥 Загрузка PDF для безопасной книги...');
        
        const pdfPages = await PDFLoader.loadPDFWithProgress(
          '/FlipbookViewer.pdf',
          (loaded, total) => {
            const progressPercent = (loaded / total) * 100;
            setProgress(progressPercent);
            console.log(`📊 Прогресс: ${loaded}/${total} (${Math.round(progressPercent)}%)`);
          },
          {
            scale: 2.0,
            quality: 0.9
          }
        );
        
        console.log('✅ PDF успешно загружен:', pdfPages.length, 'страниц');
        setPages(pdfPages);
        setLoading(false);
        
      } catch (error) {
        console.error('❌ Ошибка загрузки PDF:', error);
        
        // Fallback на демо страницы
        const demoPages = Array.from({ length: 8 }, (_, i) => 
          `data:image/svg+xml;base64,${btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
              <defs>
                <linearGradient id="grad${i}" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
                </linearGradient>
              </defs>
              <rect width="400" height="600" fill="url(#grad${i})"/>
              <circle cx="200" cy="300" r="80" fill="rgba(255,255,255,0.2)"/>
              <text x="200" y="200" text-anchor="middle" font-family="serif" font-size="32" font-weight="bold" fill="white">
                Каталог
              </text>
              <text x="200" y="240" text-anchor="middle" font-family="serif" font-size="20" fill="rgba(255,255,255,0.8)">
                Стеновые панели
              </text>
              <text x="200" y="320" text-anchor="middle" font-family="sans-serif" font-size="48" font-weight="bold" fill="white">
                ${i + 1}
              </text>
              <text x="200" y="450" text-anchor="middle" font-family="sans-serif" font-size="16" fill="rgba(255,255,255,0.7)">
                Демонстрационная страница
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
            🔥 Загрузка безопасной книги
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
              background: 'linear-gradient(90deg, #667eea, #764ba2)',
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
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Заголовок */}
        <div style={{
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '10px',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            🔥 Безопасная книга-каталог
          </h1>
          <p style={{
            fontSize: '18px',
            color: 'rgba(255,255,255,0.8)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Версия без конфликтов DOM - гарантированно стабильная работа
          </p>
        </div>

        {/* Книга */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '30px'
        }}>
          <SafeBookViewer
            pages={pages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onOrientationChange={(orientation) => {
              console.log('🔄 Ориентация:', orientation);
            }}
          />
        </div>

        {/* Контролы */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '15px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            style={{
              padding: '12px 24px',
              background: currentPage === 0 ? '#ccc' : '#fff',
              color: currentPage === 0 ? '#666' : '#333',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              transition: 'all 0.2s ease'
            }}
          >
            ← Предыдущая
          </button>

          <div style={{
            padding: '12px 24px',
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            textAlign: 'center',
            minWidth: '120px'
          }}>
            {currentPage + 1} / {pages.length}
          </div>

          <button
            onClick={() => setCurrentPage(Math.min(pages.length - 1, currentPage + 1))}
            disabled={currentPage === pages.length - 1}
            style={{
              padding: '12px 24px',
              background: currentPage === pages.length - 1 ? '#ccc' : '#fff',
              color: currentPage === pages.length - 1 ? '#666' : '#333',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: currentPage === pages.length - 1 ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              transition: 'all 0.2s ease'
            }}
          >
            Следующая →
          </button>
        </div>

        {/* Информация */}
        <div style={{
          textAlign: 'center',
          marginTop: '30px'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '20px',
            backdropFilter: 'blur(10px)',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            <p style={{
              color: 'rgba(255,255,255,0.9)',
              fontSize: '14px',
              lineHeight: '1.6',
              margin: '0'
            }}>
              ✅ Эта версия использует изолированный DOM для предотвращения конфликтов с React
              <br />
              🎯 Стабильная работа без ошибок removeChild
              <br />
              📱 Полная поддержка навигации и событий
            </p>
          </div>

          <div style={{ marginTop: '20px' }}>
            <a 
              href="/book" 
              style={{
                color: 'rgba(255,255,255,0.7)',
                textDecoration: 'underline',
                fontSize: '14px'
              }}
            >
              ← Вернуться к основной версии
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}