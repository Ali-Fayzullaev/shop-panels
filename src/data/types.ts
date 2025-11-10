// Типы для работы с продуктами
export interface ProductSpecifications {
  size: string;
  thickness: string[];
  material: string;
  finish: string;
  length?: string;
}

export interface SaleInfo {
  isOnSale: boolean;
  saleEndDate: string;
  badge: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  currency: string;
  unit: string;
  image: string;
  images: string[];
  specifications: ProductSpecifications;
  description: string;
  saleInfo?: SaleInfo;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  isSpecial?: boolean;
  products: Product[];
}

export interface ProductsData {
  categories: { [key: string]: Category };
}

// Утилиты для работы с данными
export const getCategory = (categoryId: string): Category | null => {
  const data = require('./products.json') as ProductsData;
  return data.categories[categoryId] || null;
};

export const getProduct = (categoryId: string, productId: string): Product | null => {
  const category = getCategory(categoryId);
  if (!category) return null;
  
  return category.products.find(p => p.id === productId) || null;
};

export const getAllCategories = (): Category[] => {
  const data = require('./products.json') as ProductsData;
  return Object.values(data.categories);
};

export const getCategoryProducts = (categoryId: string): Product[] => {
  const category = getCategory(categoryId);
  return category?.products || [];
};

// Форматирование цены
export const formatPrice = (price: number, currency: string = '₸'): string => {
  return `${price.toLocaleString('ru-RU')} ${currency}`;
};

// Расчет скидки
export const calculateDiscount = (originalPrice: number, salePrice: number): number => {
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
};