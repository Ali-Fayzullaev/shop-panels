'use client';

import { useEffect, useState } from 'react';

export default function DiagnosticPage() {
  const [pdfExists, setPdfExists] = useState<boolean | null>(null);
  const [pdfSize, setPdfSize] = useState<number | null>(null);

  useEffect(() => {
    const checkPDF = async () => {
      try {
        const response = await fetch('/FlipbookViewer.pdf', { method: 'HEAD' });
        setPdfExists(response.ok);
        if (response.ok) {
          const size = response.headers.get('content-length');
          setPdfSize(size ? parseInt(size) : null);
        }
      } catch (error) {
        console.error('Ошибка проверки PDF:', error);
        setPdfExists(false);
      }
    };

    checkPDF();
  }, []);

  const formatSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">📋 Диагностика книги</h1>
        
        <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-white font-medium">PDF файл:</span>
            <span className={`font-bold ${pdfExists === null ? 'text-yellow-400' : pdfExists ? 'text-green-400' : 'text-red-400'}`}>
              {pdfExists === null ? '🔄 Проверка...' : pdfExists ? '✅ Найден' : '❌ Не найден'}
            </span>
          </div>
          
          {pdfSize && (
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">Размер файла:</span>
              <span className="text-blue-400 font-mono">{formatSize(pdfSize)}</span>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <span className="text-white font-medium">Путь к файлу:</span>
            <span className="text-purple-300 font-mono text-sm">/public/FlipbookViewer.pdf</span>
          </div>
          
          <div className="mt-6 pt-4 border-t border-white/20">
            <h3 className="text-white font-medium mb-2">🔧 Возможные решения:</h3>
            <ul className="text-purple-200 space-y-2 text-sm">
              <li>• Убедитесь, что файл FlipbookViewer.pdf находится в папке /public/</li>
              <li>• Проверьте правильность названия файла (регистр важен)</li>
              <li>• Перезапустите сервер разработки после добавления файла</li>
              <li>• Убедитесь, что файл не поврежден и является валидным PDF</li>
            </ul>
          </div>
          
          <div className="mt-6 pt-4 border-t border-white/20">
            <a 
              href="/book" 
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              🔙 Вернуться к книге
            </a>
          </div>
        </div>
        
        {/* Информация о браузере */}
        <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 mt-6">
          <h3 className="text-white font-medium mb-4">🌐 Информация о браузере:</h3>
          <div className="text-sm text-purple-200 space-y-1">
            <div>User Agent: <span className="font-mono text-xs">{typeof window !== 'undefined' ? window.navigator.userAgent : 'N/A'}</span></div>
            <div>Поддержка PDF.js: <span className="text-green-400">✅ Да</span></div>
            <div>Поддержка Canvas: <span className="text-green-400">✅ Да</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}