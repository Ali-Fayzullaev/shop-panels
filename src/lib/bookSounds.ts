// Sound utility for book interactions
export class BookSounds {
  private static instance: BookSounds;
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private isEnabled = true;
  private volume = 0.3;

  private constructor() {}

  static getInstance(): BookSounds {
    if (!BookSounds.instance) {
      BookSounds.instance = new BookSounds();
    }
    return BookSounds.instance;
  }

  async loadSound(name: string, url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Звуки можно загружать только на клиенте'));
        return;
      }

      const audio = new Audio();
      audio.preload = 'auto';
      audio.volume = this.volume;
      
      audio.addEventListener('canplaythrough', () => {
        this.sounds.set(name, audio);
        resolve();
      });
      
      audio.addEventListener('error', (e) => {
        console.error(`Ошибка загрузки звука ${name}:`, e);
        reject(e);
      });
      
      audio.src = url;
    });
  }

  async loadBookSounds(): Promise<void> {
    const soundPromises = [
      this.loadSound('flip', '/sounds/flip.mp3'),
      this.loadSound('open', '/sounds/flip.mp3'), // Можно использовать тот же звук
      this.loadSound('close', '/sounds/flip.mp3'), // Или добавить отдельные звуки
    ];

    try {
      await Promise.all(soundPromises);
      console.log('Все звуки книги загружены');
    } catch (error) {
      console.warn('Некоторые звуки не удалось загрузить:', error);
    }
  }

  playSound(name: string): void {
    if (!this.isEnabled) return;

    const sound = this.sounds.get(name);
    if (sound) {
      try {
        sound.currentTime = 0;
        sound.play().catch((error) => {
          console.warn(`Не удалось воспроизвести звук ${name}:`, error);
        });
      } catch (error) {
        console.warn(`Ошибка воспроизведения звука ${name}:`, error);
      }
    }
  }

  playFlip(): void {
    this.playSound('flip');
  }

  playOpen(): void {
    this.playSound('open');
  }

  playClose(): void {
    this.playSound('close');
  }

  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  isAudioEnabled(): boolean {
    return this.isEnabled;
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    this.sounds.forEach(sound => {
      sound.volume = this.volume;
    });
  }

  getVolume(): number {
    return this.volume;
  }

  stopAllSounds(): void {
    this.sounds.forEach(sound => {
      sound.pause();
      sound.currentTime = 0;
    });
  }

  destroy(): void {
    this.stopAllSounds();
    this.sounds.clear();
  }
}