'use client';

import React from 'react';
import { 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  ChevronLeft, 
  ChevronRight,
  SkipBack,
  SkipForward,
  Bookmark
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BookControlsProps {
  currentPage: number;
  totalPages: number;
  soundEnabled: boolean;
  isFullscreen: boolean;
  showControls: boolean;
  onPrevPage: () => void;
  onNextPage: () => void;
  onToggleSound: () => void;
  onToggleFullscreen: () => void;
  onGoToPage?: (page: number) => void;
  className?: string;
  isMobile?: boolean;
}

const BookControls: React.FC<BookControlsProps> = ({
  currentPage,
  totalPages,
  soundEnabled,
  isFullscreen,
  showControls,
  onPrevPage,
  onNextPage,
  onToggleSound,
  onToggleFullscreen,
  onGoToPage,
  className,
  isMobile = false,
}) => {
  const canGoPrev = currentPage > 0;
  const canGoNext = currentPage < totalPages - 1;

  const goToFirstPage = () => onGoToPage?.(0);
  const goToLastPage = () => onGoToPage?.(totalPages - 1);

  return (
    <>
      {/* Основная панель управления */}
      <div 
        className={cn(
          "fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300",
          showControls ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
          isMobile && !showControls && "opacity-100 translate-y-0", // На мобильных всегда показываем
          className
        )}
      >
        <div className="bg-black/60 backdrop-blur-xl rounded-2xl px-6 py-4 flex items-center space-x-3 border border-white/10">
          {/* Первая страница */}
          {!isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={goToFirstPage}
              disabled={!canGoPrev}
              className="h-10 w-10 p-0 rounded-full text-white hover:bg-white/20 disabled:opacity-50"
              title="Первая страница"
            >
              <SkipBack className="h-4 w-4" />
            </Button>
          )}

          {/* Предыдущая страница */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onPrevPage}
            disabled={!canGoPrev}
            className="h-10 w-10 p-0 rounded-full text-white hover:bg-white/20 disabled:opacity-50"
            title="Предыдущая страница"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          {/* Индикатор страниц */}
          <div className="flex items-center space-x-2">
            <div className="text-white text-sm font-medium min-w-20 text-center">
              {currentPage + 1} / {totalPages}
            </div>
            
            {/* Прогресс-бар */}
            <div className="w-20 h-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-linear-to-r from-blue-400 to-purple-500 transition-all duration-300"
                style={{
                  width: `${((currentPage + 1) / totalPages) * 100}%`
                }}
              />
            </div>
          </div>

          {/* Следующая страница */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onNextPage}
            disabled={!canGoNext}
            className="h-10 w-10 p-0 rounded-full text-white hover:bg-white/20 disabled:opacity-50"
            title="Следующая страница"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          {/* Последняя страница */}
          {!isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={goToLastPage}
              disabled={!canGoNext}
              className="h-10 w-10 p-0 rounded-full text-white hover:bg-white/20 disabled:opacity-50"
              title="Последняя страница"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          )}

          {/* Разделитель */}
          <div className="w-px h-6 bg-white/20" />

          {/* Звук */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSound}
            className={cn(
              "h-10 w-10 p-0 rounded-full text-white transition-all duration-200",
              soundEnabled 
                ? "bg-green-500/30 hover:bg-green-500/40" 
                : "bg-red-500/30 hover:bg-red-500/40"
            )}
            title={soundEnabled ? "Выключить звук" : "Включить звук"}
          >
            {soundEnabled ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
          </Button>

          {/* Полноэкранный режим */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleFullscreen}
            className="h-10 w-10 p-0 rounded-full text-white hover:bg-white/20"
            title={isFullscreen ? "Выйти из полноэкранного режима" : "Полноэкранный режим"}
          >
            {isFullscreen ? (
              <Minimize className="h-4 w-4" />
            ) : (
              <Maximize className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Боковые кнопки для десктопа */}
      {!isMobile && (
        <div className="fixed inset-y-0 left-0 right-0 pointer-events-none z-40">
          {/* Левая кнопка */}
          <Button
            variant="ghost"
            onClick={onPrevPage}
            disabled={!canGoPrev}
            className={cn(
              "absolute left-6 top-1/2 transform -translate-y-1/2 h-16 w-16 rounded-full",
              "bg-black/30 hover:bg-black/50 border border-white/20 backdrop-blur-sm",
              "text-white pointer-events-auto transition-all duration-300",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              showControls ? "opacity-100" : "opacity-0 hover:opacity-100"
            )}
            title="Предыдущая страница"
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          {/* Правая кнопка */}
          <Button
            variant="ghost"
            onClick={onNextPage}
            disabled={!canGoNext}
            className={cn(
              "absolute right-6 top-1/2 transform -translate-y-1/2 h-16 w-16 rounded-full",
              "bg-black/30 hover:bg-black/50 border border-white/20 backdrop-blur-sm",
              "text-white pointer-events-auto transition-all duration-300",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              showControls ? "opacity-100" : "opacity-0 hover:opacity-100"
            )}
            title="Следующая страница"
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </div>
      )}

      {/* Мобильные области для тапов */}
      {isMobile && (
        <>
          <button
            onClick={onPrevPage}
            disabled={!canGoPrev}
            className="fixed left-0 top-0 w-1/4 h-full z-30 opacity-0"
            aria-label="Предыдущая страница"
          />
          <button
            onClick={onNextPage}
            disabled={!canGoNext}
            className="fixed right-0 top-0 w-1/4 h-full z-30 opacity-0"
            aria-label="Следующая страница"
          />
        </>
      )}
    </>
  );
};

export default BookControls;