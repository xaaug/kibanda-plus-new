import { Telegraf } from 'telegraf';
import startCommand from './commands/start';
import subscribeCommand from './commands/subscribe';

export default function setupBot(bot: Telegraf) {
  bot.start(startCommand);
  bot.command('subscribe', subscribeCommand);
}
