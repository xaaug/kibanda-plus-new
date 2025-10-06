import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';

dotenv.config();

/**
 * The main Telegraf bot instance.
 *
 * This instance is created using the bot token from the environment variables.
 * It is exported for use in other parts of the application to interact with the Telegram API.
 *
 * @type {Telegraf}
 */
export const bot = new Telegraf(process.env.BOT_TOKEN!);
