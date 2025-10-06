import { Context } from 'telegraf';

/**
 * Handles the /start command.
 *
 * This function sends a welcome message to the user when they start interacting with the bot.
 *
 * @param {Context} ctx - The Telegraf context object.
 */
export default function startCommand(ctx: Context) {
  ctx.reply('🎬 Welcome to Kibanda Plus! Use /subscribe to get started.');
}
