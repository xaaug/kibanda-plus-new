import { Context, Markup, Telegraf } from 'telegraf';
import { subscriptionPackages } from '../../config/packages';

const pendingPurchases = new Map<number, string>();

export async function showSubscriptionPackages(ctx: Context) {
  const buttons = subscriptionPackages.map(pkg =>
    Markup.button.callback(`${pkg.name} – ${pkg.price} KES`, `buy_${pkg.id}`)
  );

  await ctx.reply('💳 Choose your subscription package:', Markup.inlineKeyboard(buttons, { columns: 1 }));
}

export function registerSubscriptionActions(bot: Telegraf) {
  subscriptionPackages.forEach(pkg => {
    bot.action(`buy_${pkg.id}`, async (ctx) => {
      const chatId = ctx.chat?.id;
      if (!chatId) return;

      pendingPurchases.set(chatId, pkg.id);

      await ctx.answerCbQuery();
      await ctx.reply(
        `📱 Send your phone number to receive a payment prompt for *${pkg.name}* (${pkg.price} KES)`,
        Markup.keyboard([
          Markup.button.contactRequest('📲 Share Phone Number')
        ]).oneTime().resize()
      );
    });
  });

  bot.on('contact', async (ctx) => {
    const chatId = ctx.chat?.id;
    const phone = ctx.message.contact.phone_number;
    const pkgId = pendingPurchases.get(chatId!);

    if (!pkgId) {
      return ctx.reply('❌ No active subscription request. Use /subscribe to try again.');
    }

    await ctx.reply(`👍 Phone number received: ${phone}\nSelected package: ${pkgId}`);

    // TODO: Trigger STK push 

    pendingPurchases.delete(chatId!);
  });
}
