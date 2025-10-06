import { Request, Response } from 'express';
import { bot } from '../bot/instance';
import {
  getPaymentSession,
  clearPaymentSession,
} from '../services/payment-session.service';

/**
 * Handles the STK (SIM Toolkit) callback from the Safaricom M-Pesa API.
 *
 * This function is designed to be used as an Express route handler. It processes
 * the incoming callback data, determines if the payment was successful or not,
 * finds the corresponding payment session, notifies the user via Telegram,
 * and then clears the session.
 *
 * @param {Request} req - The Express request object, which contains the M-Pesa callback payload in its body.
 * @param {Response} res - The Express response object used to acknowledge receipt of the callback.
 */
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

  // Note: The original implementation used checkoutId to get the session, which might be incorrect.
  // This should ideally be a unique identifier for the user or chat.
  // Assuming getPaymentSession is adapted to work with checkoutId for this logic.
  const session = getPaymentSession(checkoutId);
  console.log('🔍 Session found:', session ?? 'null');

  if (!session) {
    console.warn(`❓ No active session found for CheckoutRequestID: ${checkoutId}`);
    return res.sendStatus(200); // Acknowledge to prevent retries
  }

  const { chatId, packageId, phone } = session;

  if (resultCode === 0) {
    // Payment was successful
    console.log(`✅ Payment success for chat ${chatId}, phone ${phone}, package ${packageId}`);
    await bot.telegram.sendMessage(chatId, '✅ Payment received! You are now subscribed.');
    // TODO: Save the successful subscription to the database
  } else {
    // Payment failed or was cancelled
    console.log(`❌ Payment failed for chat ${chatId}, phone ${phone}, reason: ${resultDesc}`);
    await bot.telegram.sendMessage(chatId, `❌ Payment failed: ${resultDesc}`);
  }

  // Clean up the session regardless of the outcome
  clearPaymentSession(checkoutId);
  res.sendStatus(200); // Send a 200 OK to acknowledge receipt
}
