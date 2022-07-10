import { ConfigService } from '@nestjs/config';
import { TelegramOptions } from 'src/telegram/telegram.interface';

export const getTelegramConfig = (
  configService: ConfigService,
): TelegramOptions => {
  const token = configService.get('TELEGRAM_TOKEN');
  if (!token) {
    throw new Error('TELEGRAM_TOKEN not provided');
  }
  return {
    token,
    chatId: configService.get('TELEGRAM_CHAT_ID') ?? '',
  };
};
