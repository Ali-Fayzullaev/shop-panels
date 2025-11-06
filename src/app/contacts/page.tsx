import type { Metadata } from "next";
import Header from "@/components/Header";
import { ContactsHero } from "@/components/ContactsHero";
import { ContactsContent } from "@/components/ContactsContent";

export const metadata: Metadata = {
  title: "Контакты - Стеновые панели",
  description: "Свяжитесь с нами для консультации и заказа стеновых панелей. Офисы в Москве, доставка по всей России. Телефон: +7 (993) 702-17-64",
};

export default function ContactsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <ContactsHero />
      <ContactsContent />
    </div>
  );
}