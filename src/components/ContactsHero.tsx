import React from "react";
import PageHero from "@/components/PageHero";

export function ContactsHero() {
  const breadcrumbs = [
    { label: "Главная", href: "/" },
    { label: "Контакты" }
  ];

  return (
    <PageHero
      title="Контакты"
      description="Свяжитесь с нами для консультации и заказа стеновых панелей. Мы готовы ответить на все ваши вопросы и помочь выбрать идеальные панели для вашего проекта"
      backgroundImage="/images/wall3.png"
      breadcrumbs={breadcrumbs}
    />
  );
}