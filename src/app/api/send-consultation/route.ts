import { NextRequest, NextResponse } from 'next/server';

interface ConsultationRequest {
  name: string;
  phone: string;
  email: string;
  question?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { name, phone, email, question }: ConsultationRequest = await request.json();

    // Проверяем обязательные поля
    if (!name || !phone || !email) {
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

    // Проверяем наличие всех необходимых переменных
    if (!idInstance || !apiTokenInstance || !chatId) {
      console.error('Отсутствуют переменные окружения для консультации:', {
        idInstance: !!idInstance,
        apiTokenInstance: !!apiTokenInstance,
        chatId: !!chatId
      });
      
      // Возвращаем успех для пользователя, но логируем ошибку
      return NextResponse.json({
        success: true,
        message: 'Заявка на консультацию принята',
        note: 'Мы свяжемся с вами в ближайшее время'
      });
    }

    // Формируем сообщение
    let messageText = `💬 *ЗАЯВКА НА КОНСУЛЬТАЦИЮ*\n\n`;
    
    messageText += `👤 *Информация о клиенте:*\n`;
    messageText += `Имя: ${name}\n`;
    messageText += `Телефон: ${phone}\n`;
    messageText += `Email: ${email}\n`;
    
    if (question && question.trim()) {
      messageText += `\n❓ *Вопрос клиента:*\n`;
      messageText += `"${question}"\n`;
    }

    messageText += `\n📅 Дата заявки: ${new Date().toLocaleString('ru-RU')}\n`;
    messageText += `\n📞 Необходимо перезвонить клиенту в течение 15 минут!`;

    // Отправляем сообщение через Green API
    const apiUrl = `${greenApiUrl}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatId: chatId,
        message: messageText,
      }),
    });

    const responseText = await response.text();
    let result;
    
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      console.error('Не удалось распарсить ответ Green API (consultation):', responseText);
      throw new Error(`Неверный ответ от Green API: ${responseText.substring(0, 100)}`);
    }

    if (!response.ok) {
      console.error('Green API Error (consultation):', response.status, result);
      throw new Error(`Green API Error: ${response.status} - ${result?.error || 'Неизвестная ошибка'}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Заявка на консультацию успешно отправлена',
      messageId: result.idMessage,
    });

  } catch (error) {
    console.error('Ошибка отправки заявки на консультацию:', error);
    
    // Логируем детальную информацию об ошибке
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return NextResponse.json(
      {
        success: false,
        message: 'Ошибка при отправке заявки на консультацию. Попробуйте позвонить нам.',
        error: error instanceof Error ? error.message : 'Неизвестная ошибка',
      },
      { status: 500 }
    );
  }
}