import { NextRequest, NextResponse } from 'next/server';

interface FeedbackRequest {
  name: string;
  phone: string;
  email: string;
  message?: string;
}

export async function POST(request: NextRequest) {
  console.log('🔥 API /send-feedback: Получен запрос');
  
  try {
    const requestBody = await request.text();
    console.log('📥 Тело запроса (RAW):', requestBody);
    
    let feedbackData: FeedbackRequest;
    try {
      feedbackData = JSON.parse(requestBody);
      console.log('📝 Распарсенные данные:', feedbackData);
    } catch (parseError) {
      console.error('❌ Ошибка парсинга тела запроса:', parseError);
      return NextResponse.json(
        { success: false, message: 'Неверный формат данных запроса' },
        { status: 400 }
      );
    }

    const { name, phone, email, message } = feedbackData;

    // Проверяем обязательные поля
    if (!name || !phone || !email) {
      console.log('⚠️ Не заполнены обязательные поля:', { name: !!name, phone: !!phone, email: !!email });
      return NextResponse.json(
        { success: false, message: 'Заполните обязательные поля: имя, телефон и email' },
        { status: 400 }
      );
    }

    // Конфигурация Green API с проверкой переменных окружения
    const greenApiUrl = process.env.GREEN_API_URL || 'https://7103.api.green-api.com';
    const idInstance = process.env.GREEN_API_ID_INSTANCE;
    const apiTokenInstance = process.env.GREEN_API_TOKEN;
    const chatId = process.env.GREEN_API_FEEDBACK_CHAT_ID;

    console.log('🔧 Переменные окружения:');
    console.log('  - GREEN_API_URL:', greenApiUrl);
    console.log('  - GREEN_API_ID_INSTANCE:', idInstance ? `${idInstance.substring(0, 5)}...` : 'НЕТ');
    console.log('  - GREEN_API_TOKEN:', apiTokenInstance ? `${apiTokenInstance.substring(0, 10)}...` : 'НЕТ');
    console.log('  - GREEN_API_FEEDBACK_CHAT_ID:', chatId ? `${chatId.substring(0, 10)}...` : 'НЕТ');

    // Проверяем наличие всех необходимых переменных
    if (!idInstance || !apiTokenInstance || !chatId) {
      console.error('❌ Отсутствуют переменные окружения для отправки обратной связи:', {
        idInstance: !!idInstance,
        apiTokenInstance: !!apiTokenInstance,
        chatId: !!chatId
      });
      
      // Сохраняем заявку в лог для ручной обработки
      console.log('💾 ЗАЯВКА ДЛЯ РУЧНОЙ ОБРАБОТКИ:');
      console.log('='.repeat(50));
      console.log(`Дата: ${new Date().toLocaleString('ru-RU')}`);
      console.log(`Имя: ${name}`);
      console.log(`Телефон: ${phone}`);
      console.log(`Email: ${email}`);
      if (message) console.log(`Сообщение: ${message}`);
      console.log('='.repeat(50));
      
      return NextResponse.json({
        success: true,
        message: 'Заявка принята в обработку',
        note: 'Мы свяжемся с вами в ближайшее время'
      });
    }

    // Формируем сообщение
    let messageText = `📞 *НОВАЯ ЗАЯВКА НА КОНСУЛЬТАЦИЮ*\n\n`;
    
    messageText += `👤 *Информация о клиенте:*\n`;
    messageText += `Имя: ${name}\n`;
    messageText += `Телефон: ${phone}\n`;
    messageText += `Email: ${email}\n`;
    
    if (message && message.trim()) {
      messageText += `\n💬 *Сообщение:*\n`;
      messageText += `"${message}"\n`;
    }

    messageText += `\n📅 Дата заявки: ${new Date().toLocaleString('ru-RU')}\n`;
    messageText += `\n⏰ Свяжитесь с клиентом в течение 15 минут!`;

    console.log('📱 Сообщение для WhatsApp:', messageText);

    // ВРЕМЕННО: Проверяем состояние Green API инстанса
    const stateUrl = `${greenApiUrl}/waInstance${idInstance}/getStateInstance/${apiTokenInstance}`;
    console.log('🔍 Проверяем состояние инстанса:', stateUrl);
    
    try {
      const stateResponse = await fetch(stateUrl);
      const stateData = await stateResponse.text();
      console.log('📊 Состояние инстанса Green API:', stateData);
    } catch (stateError) {
      console.warn('⚠️ Не удалось проверить состояние инстанса:', stateError);
    }

    // Отправляем сообщение через Green API
    const apiUrl = `${greenApiUrl}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`;
    console.log('🌐 URL для Green API:', apiUrl);
    
    const requestPayload = {
      chatId: chatId,
      message: messageText,
    };
    console.log('📦 Payload для Green API:', requestPayload);

    console.log('🚀 Отправляем запрос к Green API...');
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload),
    });

    console.log('📊 Ответ от Green API:');
    console.log('  - Status:', response.status);
    console.log('  - StatusText:', response.statusText);

    const responseText = await response.text();
    console.log('📄 Тело ответа Green API (RAW):', responseText);

    // ВРЕМЕННОЕ РЕШЕНИЕ: Если Green API не работает, сохраняем заявку в логи
    if (!response.ok || responseText.includes('403 Forbidden') || responseText.includes('<html>')) {
      console.log('⚠️ Green API недоступен. Сохраняем заявку для ручной обработки:');
      console.log('💾 ЗАЯВКА ДЛЯ РУЧНОЙ ОБРАБОТКИ (Green API Error):');
      console.log('='.repeat(50));
      console.log(`Дата: ${new Date().toLocaleString('ru-RU')}`);
      console.log(`Имя: ${name}`);
      console.log(`Телефон: ${phone}`);
      console.log(`Email: ${email}`);
      if (message) console.log(`Сообщение: ${message}`);
      console.log(`Green API Status: ${response.status}`);
      console.log(`Green API Response: ${responseText.substring(0, 200)}`);
      console.log('='.repeat(50));
      
      // Возвращаем успех пользователю
      return NextResponse.json({
        success: true,
        message: 'Заявка принята! Мы обязательно свяжемся с вами в ближайшее время.',
        note: 'Обработка через резервный канал'
      });
    }

    let result;
    
    try {
      result = JSON.parse(responseText);
      console.log('✅ Распарсенный ответ Green API:', result);
    } catch (e) {
      console.error('❌ Не удалось распарсить ответ Green API:', responseText);
      
      // Сохраняем заявку как резерв
      console.log('💾 ЗАЯВКА ДЛЯ РУЧНОЙ ОБРАБОТКИ (Parse Error):');
      console.log('='.repeat(50));
      console.log(`Дата: ${new Date().toLocaleString('ru-RU')}`);
      console.log(`Имя: ${name}`);
      console.log(`Телефон: ${phone}`);
      console.log(`Email: ${email}`);
      if (message) console.log(`Сообщение: ${message}`);
      console.log('='.repeat(50));
      
      return NextResponse.json({
        success: true,
        message: 'Заявка принята! Мы свяжемся с вами в ближайшее время.',
        note: 'Обработка через резервный канал'
      });
    }

    if (!response.ok) {
      console.error('❌ Green API вернул ошибку:', response.status, result);
      throw new Error(`Green API Error: ${response.status} - ${result?.error || 'Неизвестная ошибка'}`);
    }

    console.log('🎉 Заявка успешно отправлена в WhatsApp!');
    
    return NextResponse.json({
      success: true,
      message: 'Заявка успешно отправлена',
      messageId: result.idMessage,
    });

  } catch (error) {
    console.error('💥 Ошибка отправки заявки на консультацию:', error);
    
    // Логируем детальную информацию об ошибке
    if (error instanceof Error) {
      console.error('📜 Error message:', error.message);
      console.error('📜 Error stack:', error.stack);
    }
    
    return NextResponse.json(
      {
        success: false,
        message: 'Ошибка при отправке заявки. Попробуйте позвонить нам напрямую.',
        error: error instanceof Error ? error.message : 'Неизвестная ошибка',
      },
      { status: 500 }
    );
  }
}