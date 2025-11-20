import { useCallback, useEffect, useRef, useState } from 'react';
import { PageFlip } from 'page-flip';

export interface BookState {
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  soundEnabled: boolean;
  isFullscreen: boolean;
  showControls: boolean;
  isMobile: boolean;
}

export interface BookActions {
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  toggleSound: () => void;
  toggleFullscreen: () => void;
  setShowControls: (show: boolean) => void;
}

export function useBookState(pages: string[]): [BookState, BookActions, PageFlip | null] {
  const pageFlipRef = useRef<PageFlip | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [state, setState] = useState<BookState>({
    currentPage: 0,
    totalPages: 0,
    isLoading: true,
    soundEnabled: true,
    isFullscreen: false,
    showControls: true,
    isMobile: false,
  });

  // Определение мобильного устройства
  useEffect(() => {
    const checkMobile = () => {
      setState(prev => ({ ...prev, isMobile: window.innerWidth < 768 }));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Инициализация аудио
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('/sounds/flip.mp3');
      audioRef.current.preload = 'auto';
      audioRef.current.volume = 0.3;
    }
  }, []);

  // Обновление общего количества страниц
  useEffect(() => {
    setState(prev => ({ 
      ...prev, 
      totalPages: pages.length,
      isLoading: pages.length === 0
    }));
  }, [pages]);

  // Функция воспроизведения звука
  const playFlipSound = useCallback(() => {
    if (state.soundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  }, [state.soundEnabled]);

  // Управление автоскрытием контролов
  const resetControlsTimeout = useCallback(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    setState(prev => ({ ...prev, showControls: true }));
    
    controlsTimeoutRef.current = setTimeout(() => {
      setState(prev => ({ ...prev, showControls: false }));
    }, 3000);
  }, []);

  // События пользователя для показа контролов
  useEffect(() => {
    const handleUserActivity = () => resetControlsTimeout();

    document.addEventListener('mousemove', handleUserActivity);
    document.addEventListener('touchstart', handleUserActivity);
    document.addEventListener('click', handleUserActivity);

    resetControlsTimeout();

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = null;
      }
      document.removeEventListener('mousemove', handleUserActivity);
      document.removeEventListener('touchstart', handleUserActivity);
      document.removeEventListener('click', handleUserActivity);
    };
  }, [resetControlsTimeout]);

  // Навигация
  const nextPage = useCallback(() => {
    if (pageFlipRef.current && state.currentPage < state.totalPages - 1) {
      pageFlipRef.current.flipNext();
      playFlipSound();
    }
  }, [state.currentPage, state.totalPages, playFlipSound]);

  const prevPage = useCallback(() => {
    if (pageFlipRef.current && state.currentPage > 0) {
      pageFlipRef.current.flipPrev();
      playFlipSound();
    }
  }, [state.currentPage, playFlipSound]);

  const goToPage = useCallback((page: number) => {
    if (pageFlipRef.current && page >= 0 && page < state.totalPages) {
      pageFlipRef.current.flip(page);
      setState(prev => ({ ...prev, currentPage: page }));
      playFlipSound();
    }
  }, [state.totalPages, playFlipSound]);

  // Переключение звука
  const toggleSound = useCallback(() => {
    setState(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  }, []);

  // Полноэкранный режим
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setState(prev => ({ ...prev, isFullscreen: true }));
      }).catch(() => {});
    } else {
      document.exitFullscreen().then(() => {
        setState(prev => ({ ...prev, isFullscreen: false }));
      }).catch(() => {});
    }
  }, []);

  const setShowControls = useCallback((show: boolean) => {
    setState(prev => ({ ...prev, showControls: show }));
  }, []);

  // Клавиатурная навигация
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          prevPage();
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          nextPage();
          break;
        case 'Home':
          goToPage(0);
          break;
        case 'End':
          goToPage(state.totalPages - 1);
          break;
        case 'f':
        case 'F':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            toggleFullscreen();
          }
          break;
        case 'm':
        case 'M':
          toggleSound();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [nextPage, prevPage, goToPage, toggleFullscreen, toggleSound, state.totalPages]);

  const actions: BookActions = {
    nextPage,
    prevPage,
    goToPage,
    toggleSound,
    toggleFullscreen,
    setShowControls,
  };

  return [state, actions, pageFlipRef.current];
}