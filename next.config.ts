import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Отключаем проблемные экспериментальные функции
  experimental: {
    // Используем стабильные настройки
  },
  // Пустая конфигурация Turbopack для совместимости
  turbopack: {}
};

export default nextConfig;
