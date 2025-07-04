import { Context, Markup, Telegraf } from "telegraf";
import { subscriptionPackages } from "../../config/packages";
import { sendStkPush } from "../../services/mpesa.service";
import { createPaymentSession, clearPaymentSession } from "../../services/payment-session.service";

type PendingPurchase = {
  packageId: string;
  awaitingPhone: boolean;
};

const pendingPurchases = new Map<number, PendingPurchase>();

export async function showSubscriptionPackages(ctx: Context) {
  const buttons = subscriptionPackages.map((pkg) =>
    Markup.button.callback(`${pkg.name} – ${pkg.price} KES`, `buy_${pkg.id}`)
  );

  await ctx.reply(
    "Choose your subscription package:",
    Markup.inlineKeyboard(buttons, { columns: 1 })
  );
}

export function registerSubscriptionActions(bot: Telegraf) {
  subscriptionPackages.forEach((pkg) => {
    bot.action(`buy_${pkg.id}`, async (ctx) => {
      const chatId = ctx.chat?.id;
      if (!chatId) return;

      console.log(`User ${chatId} selected package: ${pkg.id}`);
      pendingPurchases.set(chatId, { packageId: pkg.id, awaitingPhone: true });

      await ctx.answerCbQuery();
      await ctx.reply(
        `Send your phone number (start with 254...) to receive a payment prompt for *${pkg.name}* (${pkg.price} KES)`,
        Markup.keyboard([
          Markup.button.contactRequest("Share Phone Number"),
        ])
          .oneTime()
          .resize()
      );
    });
  });

  // Contact share
  bot.on("contact", async (ctx) => {
    const chatId = ctx.chat?.id;
    const phone = ctx.message.contact.phone_number;
    if (!chatId) return;

    const pending = pendingPurchases.get(chatId);
    if (!pending || !pending.awaitingPhone) return;

    console.log(`Received contact from ${phone} for chat ID ${chatId}`);
    await handlePayment(ctx, chatId, phone, pending.packageId);
  });

  // Text input
  bot.on("text", async (ctx) => {
    const chatId = ctx.chat?.id;
    const message = ctx.message.text;
    if (!chatId) return;

    const pending = pendingPurchases.get(chatId);
    if (!pending || !pending.awaitingPhone) return;

    if (!/^254\d{9}$/.test(message)) {
      return ctx.reply("⚠️ Invalid phone number. Format: 2547XXXXXXXX");
    }

    console.log(`Received typed phone: ${message} from chat ID ${chatId}`);
    await handlePayment(ctx, chatId, message, pending.packageId);
  });
}

async function handlePayment(
  ctx: Context,
  chatId: number,
  phone: string,
  pkgId: string
) {
  const selectedPkg = subscriptionPackages.find((p) => p.id === pkgId);
  if (!selectedPkg) {
    return ctx.reply("⚠️ Invalid subscription package. Try again.");
  }

  try {
    console.log(`📲 Sending STK Push to ${phone} for KES ${selectedPkg.price}`);
    const result = await sendStkPush(phone, selectedPkg.price);
    const checkoutRequestId = result.CheckoutRequestID;

    createPaymentSession(chatId, phone, pkgId, checkoutRequestId, async () => {
      await ctx.reply("You didn’t complete the payment. Use /subscribe to try again.");
    });

    await ctx.reply(
      `STK Push sent for ${selectedPkg.name}. Enter your M-Pesa PIN to complete the payment.`
    );

    console.log("✅ STK Push request sent.");
  } catch (err: any) {
    console.error("❌ STK Push error:", err.message);
    await ctx.reply("Failed to initiate payment. Try again later.");
  }

  pendingPurchases.delete(chatId);
}
