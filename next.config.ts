import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Отключаем проблемные экспериментальные функции
  experimental: {
    // Используем стабильные настройки
  },
  // Дополнительные настройки webpack для совместимости
  webpack: (config: any) => {
    return config;
  }
};

export default nextConfig;
