"use client";

import { useState } from 'react';
import { CartItem } from '@/contexts/CartContext';

interface CustomerInfo {
  name?: string;
  phone?: string;
  email?: string;
}

interface UseOrderReturn {
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
  sendOrder: (items: CartItem[], total: number, customerInfo?: CustomerInfo) => Promise<void>;
  resetState: () => void;
}

export function useOrder(): UseOrderReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendOrder = async (items: CartItem[], total: number, customerInfo?: CustomerInfo) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const response = await fetch('/api/send-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          total,
          customerInfo,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Ошибка при отправке заказа');
      }

      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла неизвестная ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setIsLoading(false);
    setIsSuccess(false);
    setError(null);
  };

  return {
    isLoading,
    isSuccess,
    error,
    sendOrder,
    resetState,
  };
}