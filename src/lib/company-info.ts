// Глобальная информация о компании
export const COMPANY_INFO = {
  name: "Marmarill",
  phone: "+7‒771‒345‒36‒84",
  phoneClean: "+77713453684", // для ссылок
  email: "marmarill.kz",
  instagram: "https://www.instagram.com/marmarill_decor.kz",
  whatsapp: "+7 771 345 3684",
  telegram: "https://t.me/+77713453684",
  address: "Улица Анет баба, 9, Астана",
  logo: "/logo01.png",
  
  // Дополнительные полезные данные
  workingHours: "Пн-Пт: 9:00-18:00, Сб: 10:00-16:00",
  description: "Производитель декоративных панелей премиум-класса"
};

// Утилитные функции для форматирования
export const formatPhoneForCall = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;
export const formatPhoneForWhatsApp = (phone: string) => `https://wa.me/${phone.replace(/[^\d]/g, '')}`;
export const formatEmailLink = (email: string) => `mailto:${email}`;