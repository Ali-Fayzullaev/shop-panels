import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Оптимизация изображений
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: ['marmarill.kz', 'placehold.co', 'cdnjs.cloudflare.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  
  // Настройки для работы с PDF и внешними ресурсами
  async headers() {
    return [
      {
        source: '/pdf/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, HEAD, OPTIONS',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  
  // Настройки webpack для работы с PDF.js
  webpack: (config, { isServer }) => {
    // Игнорируем fs модуль на клиенте
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    
    // Поддержка PDF файлов
    config.module.rules.push({
      test: /\.pdf$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/pdf/[name][ext]',
      },
    });
    
    return config;
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

};

export default nextConfig;
