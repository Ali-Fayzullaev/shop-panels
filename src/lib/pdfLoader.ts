// PDF Loader utility
declare global {
  interface Window {
    pdfjsLib: any;
  }
}

export interface PDFLoaderOptions {
  scale?: number;
  quality?: number;
}

export class PDFLoader {
  private static isLoaded = false;
  private static loadPromise: Promise<void> | null = null;

  static async loadPDFJS(): Promise<void> {
    if (this.isLoaded) return;
    if (this.loadPromise) return this.loadPromise;

    this.loadPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('PDFLoader можно использовать только на клиенте'));
        return;
      }

      // Проверяем, не загружен ли уже PDF.js
      if (window.pdfjsLib) {
        this.isLoaded = true;
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.onload = () => {
        if (window.pdfjsLib) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = 
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          this.isLoaded = true;
          resolve();
        } else {
          reject(new Error('PDF.js не удалось загрузить'));
        }
      };
      script.onerror = () => {
        reject(new Error('Ошибка загрузки PDF.js'));
      };
      
      document.head.appendChild(script);
    });

    return this.loadPromise;
  }

  static async loadPDFFromURL(
    url: string, 
    options: PDFLoaderOptions = {}
  ): Promise<string[]> {
    await this.loadPDFJS();
    
    const { scale = 2.0, quality = 0.92 } = options;
    
    try {
      const loadingTask = window.pdfjsLib.getDocument(url);
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;
      
      console.log(`Загружается PDF с ${numPages} страницами`);
      
      const pagePromises: Promise<string>[] = [];
      
      for (let i = 1; i <= numPages; i++) {
        pagePromises.push(
          pdf.getPage(i).then(async (page: any) => {
            const viewport = page.getViewport({ scale });
            
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d')!;
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            
            const renderContext = {
              canvasContext: context,
              viewport: viewport,
            };
            
            await page.render(renderContext).promise;
            return canvas.toDataURL('image/jpeg', quality);
          })
        );
      }

      const pages = await Promise.all(pagePromises);
      console.log(`Успешно конвертировано ${pages.length} страниц`);
      return pages;
      
    } catch (error) {
      console.error('Ошибка загрузки PDF:', error);
      throw error;
    }
  }

  static async loadPDFWithProgress(
    url: string,
    onProgress?: (loaded: number, total: number) => void,
    options: PDFLoaderOptions = {}
  ): Promise<string[]> {
    await this.loadPDFJS();
    
    const { scale = 2.0, quality = 0.92 } = options;
    
    try {
      const loadingTask = window.pdfjsLib.getDocument({
        url,
        onProgress: (progress: { loaded: number; total: number }) => {
          onProgress?.(progress.loaded, progress.total);
        },
      });
      
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;
      
      const pages: string[] = [];
      
      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };
        
        await page.render(renderContext).promise;
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        pages.push(dataUrl);
        
        // Уведомляем о прогрессе конвертации
        onProgress?.(i, numPages);
      }

      return pages;
      
    } catch (error) {
      console.error('Ошибка загрузки PDF с прогрессом:', error);
      throw error;
    }
  }
}