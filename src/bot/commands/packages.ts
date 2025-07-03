import { Context } from 'telegraf';
import { subscriptionPackages } from '../../config/packages';

export default async function packagesCommand(ctx: Context) {
  const msg = subscriptionPackages.map(pkg =>
    ` *${pkg.name}*\n ${pkg.price} KES\n ${pkg.description}\n`
  ).join('\n');

  await ctx.replyWithMarkdown(`*Available Packages:*\n\n${msg}`);
}
