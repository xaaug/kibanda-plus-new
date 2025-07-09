import { Request, Response } from 'express';
import { bot } from '../bot/instance';
import {
  getPaymentSession,
  clearPaymentSession,
} from '../services/payment-session.service';

export async function handleStkCallback(req: Request, res: Response) {
  console.log('📥 Callback hit!');
  console.log('👉 Full payload:', JSON.stringify(req.body, null, 2));

  const callback = req.body?.Body?.stkCallback;

  if (!callback) {
    console.warn('🚫 Invalid STK callback payload:', req.body);
    return res.sendStatus(400);
  }

  const checkoutId = callback.CheckoutRequestID;
  const resultCode = callback.ResultCode;
  const resultDesc = callback.ResultDesc;

  console.log(`📨 STK Callback: ${checkoutId} | Code: ${resultCode} - ${resultDesc}`);

  const session = getPaymentSession(checkoutId);
  console.log('🔍 Session found:', session ?? 'null');

  if (!session) {
    console.warn(`❓ No active session found for CheckoutRequestID: ${checkoutId}`);
    return res.sendStatus(200);
  }

  const { chatId, packageId, phone } = session;

  if (resultCode === 0) {
    console.log(`✅ Payment success for chat ${chatId}, phone ${phone}, package ${packageId}`);
    await bot.telegram.sendMessage(chatId, '✅ Payment received! You are now subscribed.');
    // TODO: Save to DB
  } else {
    console.log(`❌ Payment failed for chat ${chatId}, phone ${phone}, reason: ${resultDesc}`);
    await bot.telegram.sendMessage(chatId, `❌ Payment failed: ${resultDesc}`);
  }

  clearPaymentSession(checkoutId);
  res.sendStatus(200);
}
