import { Telegraf } from 'telegraf';
import startCommand from './commands/start';
import subscribeCommand from './commands/subscribe';
import packagesCommand from './commands/packages';
import { registerSubscriptionActions } from './handlers/subscription.handler';

/**
 * Sets up the bot with all the necessary commands and handlers.
 *
 * This function registers the command handlers for `start`, `subscribe`, and `packages`.
 * It also registers the subscription-related action handlers.
 *
 * @param {Telegraf} bot - The Telegraf bot instance to configure.
 */
export default function setupBot(bot: Telegraf) {
  bot.start(startCommand);
  bot.command('subscribe', subscribeCommand);
  bot.command('packages', packagesCommand);

  registerSubscriptionActions(bot);
}

