import { Context } from 'telegraf';
import { showSubscriptionPackages } from '../handlers/subscription.handler';

/**
 * Handles the /subscribe command.
 *
 * This function calls the `showSubscriptionPackages` handler to display the
 * available subscription options to the user.
 *
 * @param {Context} ctx - The Telegraf context object.
 */
export default async function subscribeCommand(ctx: Context) {
  await showSubscriptionPackages(ctx);
}
