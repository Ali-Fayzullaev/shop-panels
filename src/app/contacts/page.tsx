import type { Metadata } from "next";
import Header from "@/components/Header";
import { ContactsHero } from "@/components/ContactsHero";
import { ContactsContent } from "@/components/ContactsContent";
import { COMPANY_INFO } from "@/lib/company-info";

export const metadata: Metadata = {
  title: `Контакты - ${COMPANY_INFO.name}`,
  description: `Свяжитесь с нами для консультации и заказа стеновых панелей. Офис в Астане, доставка по всему Казахстану. Телефон: ${COMPANY_INFO.phone}`,
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