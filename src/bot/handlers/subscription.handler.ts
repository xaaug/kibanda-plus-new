import { Context, Markup } from 'telegraf';
import { subscriptionPackages } from '../../config/packages';

export async function showSubscriptionPackages(ctx: Context) {
  const buttons = subscriptionPackages.map(pkg =>
    Markup.button.callback(`${pkg.name} – ${pkg.price} KES`, `buy_${pkg.id}`)
  );

  await ctx.reply('💳 Choose your subscription package:', Markup.inlineKeyboard(buttons, { columns: 1 }));
}
