@echo off
REM Скрипт для деплоя в продакшн (Windows)

echo 🚀 Начинаем деплой в продакшн...

REM Установка зависимостей
echo 📦 Установка зависимостей...
npm ci --only=production

REM Сборка для продакшна
echo 🔨 Сборка приложения...
set NODE_ENV=production
npm run build

REM Запуск в продакшн режиме
echo 🌟 Запуск приложения в продакшн режиме...
npm start

echo ✅ Деплой завершен!