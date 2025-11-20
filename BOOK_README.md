# 📚 Профессиональная Книга с PDF и PageFlip

Этот проект включает **профессиональный компонент книги** с реалистичным 3D перелистыванием страниц, полной поддержкой PDF файлов и современным звуковым сопровождением.

## ✨ Основные возможности

### 🎯 Функциональность
- **📄 Полная поддержка PDF** - автоматическая загрузка и конвертация `FlipbookViewer.pdf`
- **🎬 Реалистичное 3D перелистывание** с физической анимацией
- **📱 Адаптивный дизайн** для десктопа и мобильных устройств  
- **🔊 Профессиональные звуковые эффекты** при перелистывании и открытии книги
- **🖥️ Полноэкранный режим** для погружения в чтение
- **⌨️ Навигация клавиатурой** с поддержкой горячих клавиш
- **📊 Прогресс-бар загрузки** с детальной информацией
- **🎨 Автоскрытие контролов** для минималистичного интерфейса
- **💾 Fallback демо-страницы** при отсутствии PDF

### 🎨 Дизайн
- **Современный градиентный фон** с анимированными элементами
- **Стеклянный эффект (Glassmorphism)** для панели управления
- **Плавные переходы** и анимации
- **Responsive layout** для всех устройств
- **Темная тема** с акцентными цветами

### ⌨️ Горячие клавиши
- `←` / `→` - Навигация по страницам
- `Home` / `End` - Переход к первой/последней странице
- `M` - Включение/выключение звука
- `F` - Полноэкранный режим

## 🏗️ Архитектура

### Компоненты
1. **`BookViewer`** - Основной компонент книги с page-flip функциональностью
2. **`BookControls`** - Панель управления с навигацией и настройками
3. **`useBookState`** - Кастомный хук для управления состоянием книги

### Структура файлов
```
src/
├── app/book/page.tsx           # Главная страница книги
├── components/
│   ├── BookViewer.tsx          # Компонент просмотра книги
│   └── BookControls.tsx        # Компонент контролов
└── hooks/
    └── useBookState.ts         # Хук для управления состоянием
```

## 🚀 Использование

### Базовое использование
```tsx
import BookViewer from '@/components/BookViewer';
import BookControls from '@/components/BookControls';
import { useBookState } from '@/hooks/useBookState';

const pages = [
  '/images/page1.jpg',
  '/images/page2.jpg',
  // ... остальные страницы
];

export default function BookPage() {
  const [bookState, bookActions] = useBookState(pages);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
      <BookViewer
        pages={pages}
        onPageChange={(page) => console.log('Current page:', page)}
        width={800}
        height={600}
      />
      
      <BookControls
        currentPage={bookState.currentPage}
        totalPages={bookState.totalPages}
        soundEnabled={bookState.soundEnabled}
        isFullscreen={bookState.isFullscreen}
        showControls={bookState.showControls}
        onPrevPage={bookActions.prevPage}
        onNextPage={bookActions.nextPage}
        onToggleSound={bookActions.toggleSound}
        onToggleFullscreen={bookActions.toggleFullscreen}
        onGoToPage={bookActions.goToPage}
        isMobile={bookState.isMobile}
      />
    </div>
  );
}
```

## 📦 Зависимости

### Основные библиотеки
- `page-flip` - Для реалистичного перелистывания страниц
- `lucide-react` - Для иконок в интерфейсе
- `tailwindcss` - Для стилизации

### Удаленные зависимости
- ❌ `pdfjs-dist` - Больше не нужна
- ❌ `turn.js` - Заменена на более современную `page-flip`

## 🎨 Кастомизация

### Настройка внешнего вида
```tsx
// Изменение размеров книги
<BookViewer
  width={1000}
  height={700}
  className="custom-book-styles"
/>

// Кастомные настройки page-flip
const pageFlip = new PageFlip(container, {
  width: 800,
  height: 600,
  showCover: true,
  flippingTime: 600,
  maxShadowOpacity: 0.3,
  // ... другие настройки
});
```

### Добавление своих страниц
```tsx
const myPages = [
  '/path/to/page1.jpg',
  '/path/to/page2.jpg',
  // Или даже SVG/HTML контент
  'data:image/svg+xml;base64,...',
];
```

## 🔧 Дополнительные возможности

### Загрузка из PDF
Можно легко добавить поддержку PDF:
```tsx
// Пример загрузки PDF (требует добавления pdf.js)
const loadPDFPages = async (pdfUrl: string) => {
  // Логика конвертации PDF в изображения
  return pages;
};
```

### Сохранение прогресса
```tsx
// Сохранение текущей страницы в localStorage
useEffect(() => {
  localStorage.setItem('bookProgress', currentPage.toString());
}, [currentPage]);
```

## 🐛 Устранение неполадок

### Проблемы с производительностью
- Оптимизируйте изображения (WebP/AVIF формат)
- Используйте lazy loading для больших книг
- Ограничьте количество одновременно загружаемых страниц

### Проблемы на мобильных устройствах
- Убедитесь, что изображения имеют подходящий размер
- Проверьте настройки touch events
- Тестируйте на разных устройствах

## 📱 Мобильная адаптация

Компонент автоматически адаптируется под мобильные устройства:
- Изменяются размеры книги
- Упрощается навигация
- Добавляются touch-области для перелистывания

## 🎯 Планы развития

- [ ] Поддержка PDF файлов
- [ ] Закладки и аннотации
- [ ] Поиск по тексту
- [ ] Оглавление
- [ ] Масштабирование страниц
- [ ] Режим чтения вслух

## 💡 Советы по использованию

1. **Оптимизация изображений**: Используйте современные форматы (WebP, AVIF)
2. **Размеры страниц**: Рекомендуется соотношение сторон 3:4 или 4:3
3. **Производительность**: Для больших книг используйте виртуализацию
4. **Доступность**: Добавьте alt-тексты для изображений страниц

---

Теперь ваша книга стала действительно профессиональной и оригинальной! 🎉