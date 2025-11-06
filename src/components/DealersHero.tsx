import React from "react";
import PageHero from "@/components/PageHero";

export function DealersHero() {
  const breadcrumbs = [
    { label: "Главная", href: "/" },
    { label: "Дилеры" }
  ];

  return (
    <PageHero
      title="Наши дилеры"
      description="Официальные партнеры и дилеры по всей России и СНГ. Найдите ближайший к вам салон для консультации и заказа стеновых панелей с гарантией качества"
      backgroundImage="/images/wall4.png"
      breadcrumbs={breadcrumbs}
    />
  );
}