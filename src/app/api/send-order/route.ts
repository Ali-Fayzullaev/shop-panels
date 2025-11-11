import { NextRequest, NextResponse } from 'next/server';
import { CartItem } from '@/contexts/CartContext';
import { formatPrice } from '@/data/types';

interface OrderRequest {
  items: CartItem[];
  total: number;
  customerInfo?: {
    name?: string;
    phone?: string;
    email?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const { items, total, customerInfo }: OrderRequest = await request.json();

    // Конфигурация Green API
    const greenApiUrl = process.env.GREEN_API_URL || 'https://7107.api.green-api.com';
    const idInstance = process.env.GREEN_API_ID_INSTANCE || '7107367218';
    const apiTokenInstance = process.env.GREEN_API_TOKEN || '69dc47a0bd194690af704944038bd257b7fce4e4f5754b72a8';
    const chatId = process.env.GREEN_API_FEEDBACK_CHAT_ID || '120363422831194293@g.us';

    // Формируем сообщение
    let message = `🛒 *НОВЫЙ ЗАКАЗ*\n\n`;
    
    if (customerInfo?.name || customerInfo?.phone) {
      message += `👤 *Информация о клиенте:*\n`;
      if (customerInfo.name) message += `Имя: ${customerInfo.name}\n`;
      if (customerInfo.phone) message += `Телефон: ${customerInfo.phone}\n`;
      if (customerInfo.email) message += `Email: ${customerInfo.email}\n`;
      message += `\n`;
    }

    message += `📦 *Товары в заказе:*\n`;
    
    items.forEach((item, index) => {
      message += `\n${index + 1}. *${item.product.name}*\n`;
      message += `   Количество: ${item.quantity} шт.\n`;
      message += `   Цена за штуку: ${formatPrice(item.product.price)}\n`;
      
      if (item.selectedThickness) {
        message += `   Толщина: ${item.selectedThickness}\n`;
      }
      
      message += `   Подытог: ${formatPrice(item.product.price * item.quantity)}\n`;
      
      // Добавляем ссылку на товар
      const productUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/${item.categoryId || 'catalog'}/${item.product.id}`;
      message += `   🔗 Ссылка: ${productUrl}\n`;
    });

    message += `\n💰 *Общая сумма: ${formatPrice(total)}*\n`;
    message += `🚚 Доставка: Бесплатно\n\n`;
    message += `📅 Дата заказа: ${new Date().toLocaleString('ru-RU')}\n`;
    message += `\n✅ Для подтверждения заказа свяжитесь с клиентом!`;

    // Отправляем сообщение через Green API
    const response = await fetch(`${greenApiUrl}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatId: chatId,
        message: message,
      }),
    });

    if (!response.ok) {
      throw new Error(`Green API Error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      message: 'Заказ успешно отправлен',
      messageId: result.idMessage,
    });

  } catch (error) {
    console.error('Ошибка отправки заказа:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Ошибка при отправке заказа',
        error: error instanceof Error ? error.message : 'Неизвестная ошибка',
      },
      { status: 500 }
    );
  }
}