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

    // Проверяем обязательные поля
    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Корзина пуста' },
        { status: 400 }
      );
    }

    // Конфигурация Green API с проверкой переменных окружения
    const greenApiUrl = process.env.GREEN_API_URL || 'https://7103.api.green-api.com';
    const idInstance = process.env.GREEN_API_ID_INSTANCE;
    const apiTokenInstance = process.env.GREEN_API_TOKEN;
    const chatId = process.env.GREEN_API_FEEDBACK_CHAT_ID;

    // Проверяем наличие всех необходимых переменных
    if (!idInstance || !apiTokenInstance || !chatId) {
      console.error('Отсутствуют переменные окружения:', {
        idInstance: !!idInstance,
        apiTokenInstance: !!apiTokenInstance,
        chatId: !!chatId
      });
      
      // Сохраняем заказ в лог для ручной обработки
      console.log('💾 ЗАКАЗ ДЛЯ РУЧНОЙ ОБРАБОТКИ:');
      console.log('='.repeat(60));
      console.log(`Дата: ${new Date().toLocaleString('ru-RU')}`);
      if (customerInfo?.name) console.log(`Имя: ${customerInfo.name}`);
      if (customerInfo?.phone) console.log(`Телефон: ${customerInfo.phone}`);
      if (customerInfo?.email) console.log(`Email: ${customerInfo.email}`);
      console.log(`Общая сумма: ${formatPrice(total)}`);
      console.log('Товары:');
      items.forEach((item, index) => {
        console.log(`  ${index + 1}. ${item.product.name} - ${item.quantity} шт. - ${formatPrice(item.product.price * item.quantity)}`);
        if (item.selectedThickness) console.log(`     Толщина: ${item.selectedThickness}`);
      });
      console.log('='.repeat(60));
      
      return NextResponse.json({
        success: true,
        message: 'Заказ принят в обработку',
        note: 'Мы свяжемся с вами для подтверждения'
      });
    }

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
      const productUrl = `https://marmarill.kz/${item.categoryId || 'catalog'}/${item.product.id}`;
      message += `   🔗 Ссылка: ${productUrl}\n`;
    });

    message += `\n💰 *Общая сумма: ${formatPrice(total)}*\n`;
    message += `🚚 Доставка: Бесплатно\n\n`;
    message += `📅 Дата заказа: ${new Date().toLocaleString('ru-RU')}\n`;
    message += `\n✅ Для подтверждения заказа свяжитесь с клиентом!`;

    // Отправляем сообщение через Green API
    const apiUrl = `${greenApiUrl}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatId: chatId,
        message: message,
      }),
    });

    const responseText = await response.text();
    
    // ВРЕМЕННОЕ РЕШЕНИЕ: Если Green API не работает, сохраняем заказ в логи
    if (!response.ok || responseText.includes('403 Forbidden') || responseText.includes('<html>')) {
      console.log('⚠️ Green API недоступен. Сохраняем заказ для ручной обработки:');
      console.log('💾 ЗАКАЗ ДЛЯ РУЧНОЙ ОБРАБОТКИ (Green API Error):');
      console.log('='.repeat(60));
      console.log(`Дата: ${new Date().toLocaleString('ru-RU')}`);
      if (customerInfo?.name) console.log(`Имя: ${customerInfo.name}`);
      if (customerInfo?.phone) console.log(`Телефон: ${customerInfo.phone}`);
      if (customerInfo?.email) console.log(`Email: ${customerInfo.email}`);
      console.log(`Общая сумма: ${formatPrice(total)}`);
      console.log('Товары:');
      items.forEach((item, index) => {
        console.log(`  ${index + 1}. ${item.product.name} - ${item.quantity} шт. - ${formatPrice(item.product.price * item.quantity)}`);
        if (item.selectedThickness) console.log(`     Толщина: ${item.selectedThickness}`);
      });
      console.log(`Green API Status: ${response.status}`);
      console.log(`Green API Response: ${responseText.substring(0, 200)}`);
      console.log('='.repeat(60));
      
      // Возвращаем успех пользователю
      return NextResponse.json({
        success: true,
        message: 'Заказ принят! Мы обязательно свяжемся с вами для подтверждения.',
        note: 'Обработка через резервный канал'
      });
    }

    let result;
    
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      console.error('Не удалось распарсить ответ Green API:', responseText);
      
      // Сохраняем заказ как резерв
      console.log('💾 ЗАКАЗ ДЛЯ РУЧНОЙ ОБРАБОТКИ (Parse Error):');
      console.log('='.repeat(60));
      console.log(`Дата: ${new Date().toLocaleString('ru-RU')}`);
      if (customerInfo?.name) console.log(`Имя: ${customerInfo.name}`);
      if (customerInfo?.phone) console.log(`Телефон: ${customerInfo.phone}`);
      if (customerInfo?.email) console.log(`Email: ${customerInfo.email}`);
      console.log(`Общая сумма: ${formatPrice(total)}`);
      console.log('Товары:');
      items.forEach((item, index) => {
        console.log(`  ${index + 1}. ${item.product.name} - ${item.quantity} шт. - ${formatPrice(item.product.price * item.quantity)}`);
        if (item.selectedThickness) console.log(`     Толщина: ${item.selectedThickness}`);
      });
      console.log('='.repeat(60));
      
      return NextResponse.json({
        success: true,
        message: 'Заказ принят! Мы свяжемся с вами для подтверждения.',
        note: 'Обработка через резервный канал'
      });
    }

    if (!response.ok) {
      console.error('Green API Error:', response.status, result);
      throw new Error(`Green API Error: ${response.status} - ${result?.error || 'Неизвестная ошибка'}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Заказ успешно отправлен',
      messageId: result.idMessage,
    });

  } catch (error) {
    console.error('Ошибка отправки заказа:', error);
    
    // Логируем детальную информацию об ошибке
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return NextResponse.json(
      {
        success: false,
        message: 'Ошибка при отправке заказа. Попробуйте позвонить нам.',
        error: error instanceof Error ? error.message : 'Неизвестная ошибка',
      },
      { status: 500 }
    );
  }
}