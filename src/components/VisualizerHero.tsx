import React from 'react';
import PageHero from './PageHero';
import { Breadcrumb } from "@/components/ui/breadcrumb";

export function VisualizerHero() {
  const breadcrumbItems = [
    { label: "Главная", href: "/" },
    { label: "Визуализатор", href: "/visualizer" }
  ];

  return (
    <PageHero
      title="Визуализатор интерьера"
      description="Попробуйте разные цвета и посмотрите как панели будут выглядеть в вашем интерьере"
      backgroundImage="/images/hero-bg.webp"
      breadcrumbs={breadcrumbItems}
    />
  );
}