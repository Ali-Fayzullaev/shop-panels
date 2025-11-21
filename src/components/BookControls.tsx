'use client';

import React from 'react';
import { 
  Volume2, VolumeX, Maximize, Minimize, 
  ChevronLeft, ChevronRight, Layers
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
  onToggleGallery?: () => void;
  galleryAvailable?: boolean;
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
  onToggleGallery,
  galleryAvailable = false,
  className,
  isMobile = false,
}) => {
  const canGoPrev = currentPage > 0;
  const canGoNext = currentPage < totalPages - 1;

  return (
    <>
      {/* --- БОКОВЫЕ КНОПКИ (ТОЛЬКО DESKTOP) --- */}
      {!isMobile && (
        <>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onPrevPage();
            }}
            onMouseDown={(e) => e.preventDefault()}
            disabled={!canGoPrev}
            className={cn(
              "fixed left-8 top-1/2 -translate-y-1/2 z-50",
              "w-14 h-14 rounded-full flex items-center justify-center",
              "bg-black/20 hover:bg-black/40 text-white border border-white/10 backdrop-blur-sm",
              "transition-all duration-200 transform hover:scale-110 active:scale-95",
              "disabled:opacity-0 disabled:pointer-events-none",
              "select-none cursor-pointer",
              showControls ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            )}
            title="Предыдущая страница"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onNextPage();
            }}
            onMouseDown={(e) => e.preventDefault()}
            disabled={!canGoNext}
            className={cn(
              "fixed right-8 top-1/2 -translate-y-1/2 z-50",
              "w-14 h-14 rounded-full flex items-center justify-center",
              "bg-black/20 hover:bg-black/40 text-white border border-white/10 backdrop-blur-sm",
              "transition-all duration-200 transform hover:scale-110 active:scale-95",
              "disabled:opacity-0 disabled:pointer-events-none",
              "select-none cursor-pointer",
              showControls ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            )}
            title="Следующая страница"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </>
      )}

      {/* --- НИЖНЯЯ ПАНЕЛЬ (ВСЕГДА) --- */}
      <div 
        className={cn(
          "fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500",
          showControls ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          // На мобилке панель чуть меньше и плотнее
          isMobile ? "w-[90%] max-w-md" : "w-auto" 
        )}
      >
        <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2 sm:px-6 sm:py-3 shadow-2xl flex items-center justify-between gap-2 sm:gap-4">
            
            {/* Навигация (Назад) */}
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onPrevPage();
              }}
              disabled={!canGoPrev}
              className="text-white hover:bg-white/20 rounded-full w-10 h-10 shrink-0 select-none transition-all duration-150"
              title="Предыдущая страница"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            {/* Кнопка галереи для мобильных */}
            {isMobile && onToggleGallery && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleGallery}
                disabled={!galleryAvailable}
                className={cn(
                  "rounded-full w-8 h-8 transition-colors shrink-0",
                  galleryAvailable 
                    ? "text-purple-400 hover:bg-purple-500/20" 
                    : "text-white/30 cursor-not-allowed"
                )}
                title={galleryAvailable ? "Галерея страниц" : "Загрузка..."}
              >
                <Layers className="w-4 h-4" />
              </Button>
            )}

            {/* Инфо о страницах */}
            <div className="flex flex-col items-center px-2 min-w-80px">
              <span className="text-white text-sm font-semibold tracking-wider">
                {currentPage + 1} <span className="text-white/50">/</span> {totalPages}
              </span>
              {/* Мини прогресс-бар */}
              <div className="w-full h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
                <div 
                  className="h-full  from-blue-400 to-purple-400 transition-all duration-300"
                  style={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
                />
              </div>
            </div>

            {/* Навигация (Вперед) */}
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onNextPage();
              }}
              disabled={!canGoNext}
              className="text-white hover:bg-white/20 rounded-full w-10 h-10 shrink-0 select-none transition-all duration-150"
              title="Следующая страница"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>

            <div className="w-px h-6 bg-white/10 mx-1 hidden sm:block" />

            {/* Доп. настройки (Галерея / Звук / Экран) */}
            <div className="flex items-center gap-1">
              {/* Кнопка галереи */}
              {onToggleGallery && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggleGallery}
                  disabled={!galleryAvailable}
                  className={cn(
                    "rounded-full w-10 h-10 transition-colors",
                    galleryAvailable 
                      ? "text-purple-400 hover:bg-purple-500/20" 
                      : "text-white/30 cursor-not-allowed"
                  )}
                  title={galleryAvailable ? "Открыть галерею страниц" : "Галерея будет доступна после загрузки"}
                >
                  <Layers className="w-5 h-5" />
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleSound}
                className={cn(
                  "rounded-full w-10 h-10 transition-colors",
                  soundEnabled ? "text-green-400 hover:bg-green-500/20" : "text-white/50 hover:bg-white/20"
                )}
              >
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleFullscreen}
                className="text-white hover:bg-white/20 rounded-full w-10 h-10 hidden sm:flex"
              >
                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              </Button>
            </div>
        </div>
      </div>
    </>
  );
};

export default BookControls;