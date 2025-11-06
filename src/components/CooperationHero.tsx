import React from "react";
import PageHero from "@/components/PageHero";

export function CooperationHero() {
  const breadcrumbs = [
    { label: "Главная", href: "/" },
    { label: "Сотрудничество" }
  ];

  return (
    <PageHero
      title="Сотрудничество"
      description="Присоединяйтесь к нашей партнерской программе и развивайте успешный бизнес с качественными стеновыми панелями. Выгодные условия, поддержка и высокая маржинальность ждут вас"
      backgroundImage="/images/wall5.jpg"
      breadcrumbs={breadcrumbs}
    />
  );
}