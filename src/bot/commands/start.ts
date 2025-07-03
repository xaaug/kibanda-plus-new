import { Context } from 'telegraf';

export default function startCommand(ctx: Context) {
  ctx.reply('🎬 Welcome to Kibanda Plus! Use /subscribe to get started.');
}
