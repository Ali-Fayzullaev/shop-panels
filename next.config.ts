import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Оптимизация изображений
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: [],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Оптимизация сжатия
  compress: true,
  // Отключение x-powered-by заголовка для безопасности
  poweredByHeader: false,
  // Оптимизация для статических файлов
  trailingSlash: false,
  // Генерация ETag для кеширования
  generateEtags: true,
  // Строгие настройки React
  reactStrictMode: true,
  // Настройки для предотвращения автоматических перезагрузок
  onDemandEntries: {
    // Время ожидания перед выгрузкой страницы (в миллисекундах)
    maxInactiveAge: 60 * 1000 * 60, // 60 минут
    // Количество страниц для хранения одновременно
    pagesBufferLength: 5,
  },
  // Настройки Turbopack для стабильности
  turbopack: {
    root: process.cwd(),
  },
  // Экспериментальные функции для производительности
  experimental: {
    optimizePackageImports: ['lucide-react'],
    // Отключение автоматической перезагрузки при ошибках
    forceSwcTransforms: false,
  },
  // Настройки заголовков для лучшего кеширования
  async headers() {
    return [
      {
        source: '/favicon.ico',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
