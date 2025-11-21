# Руководство по устранению неполадок

## Проблемы с загрузкой PDF

### Ошибка 504 (Gateway Time-out)
**Симптомы:** Сообщение "Unexpected server response (504) while retrieving PDF"

**Причины:**
- Сервер временно недоступен
- Превышен таймаут запроса
- Проблемы с сетевым соединением

**Решения:**
1. **Проверьте размещение PDF файла:**
   - Разместите `FlipbookViewer.pdf` в папке `public/`
   - Альтернативно: создайте папку `public/pdf/` и поместите файл туда

2. **Увеличьте таймауты:**
   ```typescript
   // В src/lib/pdfLoader.ts уже настроено:
   timeout: 20000, // 20 секунд
   ```

3. **Проверьте альтернативные источники:**
   - Локальный файл: `/FlipbookViewer.pdf`
   - Папка PDF: `/pdf/catalog.pdf`
   - Внешний источник: `https://yourdomain.com/file.pdf`

### Ошибки CORS (Cross-Origin Resource Sharing)
**Симптомы:** "Ограничения безопасности браузера (CORS)"

**Решения:**
1. **Разместите PDF на том же домене**
2. **Настройте заголовки сервера:**
   ```nginx
   add_header Access-Control-Allow-Origin "*";
   add_header Access-Control-Allow-Methods "GET, HEAD, OPTIONS";
   ```

### Пассивные события (Passive Events)
**Симптомы:** "[Violation] Added non-passive event listener to a scroll-blocking 'touchstart' event"

**Решение:** Уже исправлено в коде:
```typescript
// В PDFLoader добавлены настройки:
disableAutoFetch: true,
disableStream: true,
disableRange: true
```

## Настройка производственного сервера

### Nginx конфигурация
```nginx
server {
    # Основные настройки...
    
    # Статические файлы PDF
    location ~* \.(pdf)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Access-Control-Allow-Origin "*";
        add_header Access-Control-Allow-Methods "GET, HEAD, OPTIONS";
    }
    
    # Увеличение таймаутов для больших файлов
    proxy_read_timeout 300;
    proxy_connect_timeout 300;
    proxy_send_timeout 300;
}
```

### Apache конфигурация
```apache
# .htaccess в папке public/
<Files "*.pdf">
    Header set Cache-Control "public, max-age=31536000"
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "GET, HEAD, OPTIONS"
</Files>

# Увеличение таймаутов
TimeOut 300
```

## Мониторинг и отладка

### Логи в консоли браузера
Ищите сообщения:
- `🔄 Попытка загрузки PDF из: ...`
- `✅ PDF успешно загружен из: ...`
- `❌ Не удалось загрузить PDF из ...`

### Сетевые запросы
1. Откройте DevTools (F12)
2. Перейдите в Network
3. Обновите страницу
4. Найдите запрос к PDF файлу
5. Проверьте статус ответа и заголовки

### Производительность
- Оптимальный размер PDF: до 10MB
- Рекомендуемое количество страниц: до 50
- Разрешение: 150-300 DPI

## Fallback механизм

При невозможности загрузки PDF автоматически отображается демо-контент:
- 12 красивых SVG страниц
- Информация о каталоге
- Номера страниц
- Декоративные элементы

## Проверка файловой системы

Убедитесь, что файлы существуют:
```bash
# Проверьте наличие PDF
ls -la public/FlipbookViewer.pdf
ls -la public/pdf/catalog.pdf

# Проверьте права доступа
chmod 644 public/FlipbookViewer.pdf
```

## Контакты для поддержки

При возникновении проблем:
1. Проверьте логи в консоли браузера
2. Убедитесь, что PDF файл доступен
3. Проверьте настройки сервера
4. При необходимости обратитесь к системному администратору