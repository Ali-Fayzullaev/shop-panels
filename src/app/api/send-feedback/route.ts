import { NextRequest, NextResponse } from 'next/server';

interface FeedbackRequest {
  name: string;
  phone: string;
  email: string;
  message?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { name, phone, email, message }: FeedbackRequest = await request.json();

    // Конфигурация Green API
    const greenApiUrl = process.env.GREEN_API_URL || 'https://7107.api.green-api.com';
    const idInstance = process.env.GREEN_API_ID_INSTANCE || '7107367218';
    const apiTokenInstance = process.env.GREEN_API_TOKEN || '69dc47a0bd194690af704944038bd257b7fce4e4f5754b72a8';
    const chatId = process.env.GREEN_API_FEEDBACK_CHAT_ID || '120363422831194293@g.us';

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

    // Отправляем сообщение через Green API
    const response = await fetch(`${greenApiUrl}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatId: chatId,
        message: messageText,
      }),
    });

    if (!response.ok) {
      throw new Error(`Green API Error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      message: 'Заявка успешно отправлена',
      messageId: result.idMessage,
    });

  } catch (error) {
    console.error('Ошибка отправки заявки:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Ошибка при отправке заявки',
        error: error instanceof Error ? error.message : 'Неизвестная ошибка',
      },
      { status: 500 }
    );
  }
}