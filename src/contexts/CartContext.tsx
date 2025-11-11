"use client";

import { createContext, useContext, useReducer, ReactNode, useEffect } from "react";
import { Product } from "@/data/types";

// Типы для корзины
export interface CartItem {
  product: Product;
  quantity: number;
  selectedThickness?: string;
}

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: { product: Product; thickness?: string } }
  | { type: "REMOVE_ITEM"; payload: { productId: string; thickness?: string } }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; quantity: number; thickness?: string } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartState };

// Редьюсер для корзины
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, thickness } = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) => item.product.id === product.id && item.selectedThickness === thickness
      );

      if (existingItemIndex >= 0) {
        // Увеличиваем количество существующего товара
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += 1;
        return {
          ...state,
          items: updatedItems,
          total: calculateTotal(updatedItems),
        };
      } else {
        // Добавляем новый товар
        const newItem: CartItem = {
          product,
          quantity: 1,
          selectedThickness: thickness,
        };
        const updatedItems = [...state.items, newItem];
        return {
          ...state,
          items: updatedItems,
          total: calculateTotal(updatedItems),
        };
      }
    }

    case "REMOVE_ITEM": {
      const { productId, thickness } = action.payload;
      const updatedItems = state.items.filter(
        (item) => !(item.product.id === productId && item.selectedThickness === thickness)
      );
      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems),
      };
    }

    case "UPDATE_QUANTITY": {
      const { productId, quantity, thickness } = action.payload;
      if (quantity <= 0) {
        // Удаляем товар если количество 0 или меньше
        const updatedItems = state.items.filter(
          (item) => !(item.product.id === productId && item.selectedThickness === thickness)
        );
        return {
          ...state,
          items: updatedItems,
          total: calculateTotal(updatedItems),
        };
      }

      const updatedItems = state.items.map((item) =>
        item.product.id === productId && item.selectedThickness === thickness 
          ? { ...item, quantity } 
          : item
      );
      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems),
      };
    }

    case "CLEAR_CART":
      return {
        items: [],
        total: 0,
      };

    case "LOAD_CART":
      return action.payload;

    default:
      return state;
  }
}

// Функция подсчета общей стоимости
function calculateTotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
}

// Функции для работы с localStorage
const CART_STORAGE_KEY = 'shop-panels-cart';

function saveCartToStorage(cartState: CartState) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartState));
    } catch (error) {
      console.error('Ошибка сохранения корзины в localStorage:', error);
    }
  }
}

function loadCartFromStorage(): CartState | null {
  if (typeof window !== 'undefined') {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        return JSON.parse(savedCart);
      }
    } catch (error) {
      console.error('Ошибка загрузки корзины из localStorage:', error);
    }
  }
  return null;
}

// Контекст
interface CartContextType {
  state: CartState;
  addToCart: (product: Product, thickness?: string) => void;
  removeFromCart: (productId: string, thickness?: string) => void;
  updateQuantity: (productId: string, quantity: number, thickness?: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getItemQuantity: (productId: string, thickness?: string) => number;
  isInCart: (productId: string, thickness?: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Провайдер корзины
interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

  // Загрузка корзины из localStorage при первом рендере
  useEffect(() => {
    const savedCart = loadCartFromStorage();
    if (savedCart) {
      dispatch({ type: "LOAD_CART", payload: savedCart });
    }
  }, []);

  // Сохранение корзины в localStorage при изменении состояния
  useEffect(() => {
    if (state.items.length > 0 || state.total > 0) {
      saveCartToStorage(state);
    }
  }, [state]);

  const addToCart = (product: Product, thickness?: string) => {
    dispatch({ type: "ADD_ITEM", payload: { product, thickness } });
  };

  const removeFromCart = (productId: string, thickness?: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { productId, thickness } });
  };

  const updateQuantity = (productId: string, quantity: number, thickness?: string) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity, thickness } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getItemQuantity = (productId: string, thickness?: string) => {
    const item = state.items.find(
      (item) => item.product.id === productId && item.selectedThickness === thickness
    );
    return item ? item.quantity : 0;
  };

  const isInCart = (productId: string, thickness?: string) => {
    return state.items.some(
      (item) => item.product.id === productId && item.selectedThickness === thickness
    );
  };

  const value: CartContextType = {
    state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getItemQuantity,
    isInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Хук для использования корзины
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}