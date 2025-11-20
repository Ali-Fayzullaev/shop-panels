'use client';

import React, { useState, useEffect } from 'react';
import SimpleBookViewer from '@/components/SimpleBookViewer';

export default function SimpleBookPage() {
  const [pages, setPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPDF = async () => {
      try {
        console.log('🔄 Начинаем загрузку PDF...');
        
        // Динамически импортируем PDF.js
        const pdfjsLib = await import('pdfjs-dist');
        
        // Устанавливаем worker
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
        
        // Загружаем PDF
        const pdf = await pdfjsLib.getDocument('/FlipbookViewer.pdf').promise;
        console.log('📄 PDF загружен, страниц:', pdf.numPages);
        
        const pagePromises = [];
        
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          pagePromises.push(
            pdf.getPage(pageNum).then(async (page) => {
              const scale = 2;
              const viewport = page.getViewport({ scale });
              
              const canvas = document.createElement('canvas');
              const context = canvas.getContext('2d')!;
              canvas.height = viewport.height;
              canvas.width = viewport.width;
              
              await page.render({
                canvasContext: context,
                viewport: viewport,
              }).promise;
              
              console.log(`✅ Страница ${pageNum} конвертирована`);
              return canvas.toDataURL('image/png', 0.95);
            })
          );
        }
        
        const convertedPages = await Promise.all(pagePromises);
        console.log('🎉 Все страницы конвертированы:', convertedPages.length);
        
        setPages(convertedPages);
        setLoading(false);
        
      } catch (error) {
        console.error('❌ Ошибка загрузки PDF:', error);
        
        // Fallback: простые демо страницы
        const demoPages = Array.from({ length: 8 }, (_, i) => 
          `data:image/svg+xml;base64,${btoa(`
            <svg width="400" height="600" xmlns="http://www.w3.org/2000/svg">
              <rect width="400" height="600" fill="#f8f9fa"/>
              <rect x="20" y="40" width="360" height="520" fill="white" stroke="#ddd"/>
              <text x="200" y="100" text-anchor="middle" font-size="24" font-weight="bold" fill="#333">
                Тестовая страница
              </text>
              <text x="200" y="140" text-anchor="middle" font-size="18" fill="#666">
                Страница ${i + 1}
              </text>
              <circle cx="200" cy="300" r="50" fill="#6366f1" opacity="0.2"/>
              <text x="200" y="310" text-anchor="middle" font-size="32" font-weight="bold" fill="#6366f1">
                ${i + 1}
              </text>
              <rect x="50" y="400" width="300" height="100" fill="#f1f5f9" stroke="#cbd5e1"/>
              <text x="200" y="440" text-anchor="middle" font-size="14" fill="#64748b">
                Это демонстрационная страница
              </text>
              <text x="200" y="460" text-anchor="middle" font-size="14" fill="#64748b">
                для тестирования PageFlip
              </text>
            </svg>
          `)}`
        );
        
        console.log('🎭 Используем демо страницы:', demoPages.length);
        setPages(demoPages);
        setLoading(false);
      }
    };

    loadPDF();
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '30px',
        color: 'white'
      }}>  
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          marginBottom: '10px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          📚 Простая книга
        </h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
          PDF Viewer с эффектом перелистывания страниц
        </p>
      </div>

      {loading ? (
        <div style={{
          background: 'rgba(255,255,255,0.9)',
          padding: '40px',
          borderRadius: '15px',
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #e3e3e3',
            borderTop: '4px solid #6366f1',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}/>
          <div style={{ fontSize: '18px', color: '#333' }}>
            Загрузка PDF из public/FlipbookViewer.pdf...
          </div>
        </div>
      ) : (
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '15px',
          padding: '20px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
          backdropFilter: 'blur(10px)'
        }}>
          <SimpleBookViewer pages={pages} />
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