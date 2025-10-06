import { Context } from 'telegraf';
import { subscriptionPackages } from '../../config/packages';

/**
 * Handles the /packages command.
 *
 * This function sends a message to the user listing all the available subscription packages.
 * The package information is retrieved from the `subscriptionPackages` configuration
 * and formatted into a Markdown message.
 *
 * @param {Context} ctx - The Telegraf context object.
 */
export default async function packagesCommand(ctx: Context) {
  const msg = subscriptionPackages.map(pkg =>
    ` *${pkg.name}*\n ${pkg.price} KES\n ${pkg.description}\n`
  ).join('\n');

  await ctx.replyWithMarkdown(`*Available Packages:*\n\n${msg}`);
}
