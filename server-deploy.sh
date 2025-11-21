#!/bin/bash

# Скрипт автоматического деплоя для продакшн сервера
# Использование: ./server-deploy.sh

set -e  # Остановить при любой ошибке

echo "🚀 Начинаем деплой на продакшн сервер..."

# Остановить текущий процесс если работает
echo "🛑 Останавливаем текущие процессы..."
pm2 stop shop-panels 2>/dev/null || echo "Процесс не найден"
pkill -f "next start" 2>/dev/null || echo "Next.js процессы не найдены"

# Обновить код (если используется git)
if [ -d ".git" ]; then
    echo "📥 Обновляем код из репозитория..."
    git pull origin main
fi

# Создать .env.local из .env.production
echo "⚙️ Настраиваем переменные окружения..."
if [ -f ".env.production" ]; then
    cp .env.production .env.local
    echo "✅ .env.local создан из .env.production"
else
    echo "⚠️ Файл .env.production не найден!"
fi

# Установить зависимости
echo "📦 Устанавливаем зависимости..."
npm ci --only=production

# Очистить предыдущую сборку
echo "🧹 Очищаем предыдущую сборку..."
rm -rf .next

# Собрать проект
echo "🔨 Собираем проект для продакшна..."
NODE_ENV=production npm run build -- --webpack

# Запустить с PM2
echo "🌟 Запускаем приложение..."
pm2 start ecosystem.config.json

# Проверить статус
echo "📊 Проверяем статус..."
sleep 3
pm2 list

# Тест доступности
echo "🧪 Тестируем доступность..."
if curl -f -s -I https://marmarill.kz > /dev/null; then
    echo "✅ Сайт доступен!"
else
    echo "❌ Сайт недоступен! Проверьте логи: pm2 logs shop-panels"
    exit 1
fi

echo "🎉 Деплой завершен успешно!"
echo "📝 Полезные команды:"
echo "   pm2 logs shop-panels  - посмотреть логи"
echo "   pm2 restart shop-panels  - перезапустить"
echo "   pm2 stop shop-panels  - остановить"