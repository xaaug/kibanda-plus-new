import { Context, Markup, Telegraf } from 'telegraf';
import { subscriptionPackages } from '../../config/packages';
import { createPaymentSession } from '../../services/payment-session.service';
import { sendStkPush } from '../../services/stk.service';

/**
 * Represents a pending purchase that is awaiting a user's phone number.
 * @typedef {object} PendingPurchase
 * @property {string} packageId - The ID of the package being purchased.
 * @property {boolean} awaitingPhone - Whether the system is waiting for the user's phone number.
 */
type PendingPurchase = {
  packageId: string;
  awaitingPhone: boolean;
};

/**
 * A map to store pending purchases, with the chat ID as the key.
 * @type {Map<number, PendingPurchase>}
 */
const pendingPurchases = new Map<number, PendingPurchase>();

/**
 * Displays the available subscription packages to the user as an inline keyboard.
 * @param {Context} ctx - The Telegraf context object.
 */
export async function showSubscriptionPackages(ctx: Context) {
  const buttons = subscriptionPackages.map((pkg) =>
    Markup.button.callback(`${pkg.name} – ${pkg.price} KES`, `buy_${pkg.id}`)
  );

  await ctx.reply(
    'Choose your subscription package:',
    Markup.inlineKeyboard(buttons, { columns: 1 })
  );
}

/**
 * Registers all the action and message handlers related to subscriptions.
 * @param {Telegraf} bot - The Telegraf bot instance.
 */
export function registerSubscriptionActions(bot: Telegraf) {
  // Register an action for each subscription package
  subscriptionPackages.forEach((pkg) => {
    bot.action(`buy_${pkg.id}`, async (ctx) => {
      const chatId = ctx.chat?.id;
      if (!chatId) return;

      pendingPurchases.set(chatId, { packageId: pkg.id, awaitingPhone: true });

      await ctx.answerCbQuery();
      await ctx.reply(
        `Send your phone number (start with 254...) to receive a payment prompt for *${pkg.name}* (${pkg.price} KES)`,
        Markup.keyboard([
          Markup.button.contactRequest('📱 Share Phone Number'),
        ])
          .oneTime()
          .resize()
      );
    });
  });

  // Handle contact sharing
  bot.on('contact', async (ctx) => {
    const chatId = ctx.chat?.id;
    const phone = ctx.message.contact.phone_number;
    if (!chatId) return;

    const pending = pendingPurchases.get(chatId);
    if (!pending?.awaitingPhone) return;

    await handlePayment(ctx, chatId, phone, pending.packageId);
  });

  // Handle phone number sent as text
  bot.on('text', async (ctx) => {
    const chatId = ctx.chat?.id;
    const message = ctx.message.text;
    if (!chatId) return;

    const pending = pendingPurchases.get(chatId);
    if (!pending?.awaitingPhone) return;

    // Validate the phone number format
    if (!/^254\d{9}$/.test(message)) {
      return ctx.reply('⚠️ Invalid phone number. Format: 2547XXXXXXXX');
    }

    await handlePayment(ctx, chatId, message, pending.packageId);
  });
}

/**
 * Handles the payment process for a subscription.
 *
 * This function sends an STK push to the user's phone, creates a payment session,
 * and sends feedback to the user.
 *
 * @param {Context} ctx - The Telegraf context object.
 * @param {number} chatId - The ID of the chat.
 * @param {string} phone - The user's phone number.
 * @param {string} pkgId - The ID of the selected package.
 */
async function handlePayment(
  ctx: Context,
  chatId: number,
  phone: string,
  pkgId: string
) {
  console.log('🔍 Handling payment...');
  console.log(`📦 Package ID: ${pkgId}`);
  console.log(`📞 Phone: ${phone}`);
  console.log(`💬 Chat ID: ${chatId}`);

  const selectedPkg = subscriptionPackages.find((p) => p.id === pkgId);
  if (!selectedPkg) {
    console.warn('⚠️ Invalid package selected:', pkgId);
    return ctx.reply('⚠️ Invalid subscription package. Try again.');
  }

  try {
    console.log(`📲 Sending STK Push to ${phone} for KES ${selectedPkg.price}`);

    const result = await sendStkPush(phone, selectedPkg.price);
    console.log('✅ STK Push response:', result);

    const checkoutRequestId = result.CheckoutRequestID;
    console.log('📦 CheckoutRequestID:', checkoutRequestId);

    // Create a payment session that will time out
    createPaymentSession(chatId, phone, pkgId, checkoutRequestId, async () => {
      console.log('⏱️ Payment session timed out for chat ID:', chatId);
      await ctx.reply('⏱️ Payment timed out. Use /subscribe to try again.');
    });

    await ctx.reply(
      `✅ STK Push sent for ${selectedPkg.name}. Enter your M-Pesa PIN to complete payment.`
    );
  } catch (err: any) {
    console.error('❌ STK Push error:', err?.message || err);
    await ctx.reply('❌ Failed to initiate payment. Try again later.');
  }

  // Clean up the pending purchase state
  pendingPurchases.delete(chatId);
}

