import axios from 'axios';
import { getTimestamp } from '../bot/mpesa/utils/timestamp.util';
import { getEnv } from '../config/validateEnv';

/**
 * Sends an STK (SIM Toolkit) push notification to a user's phone to initiate a payment.
 *
 * This function handles the entire process of an STK push, including:
 * 1. Generating a timestamp and password for the M-Pesa API.
 * 2. Obtaining an OAuth access token from Safaricom.
 * 3. Sending the actual STK push request to the user's phone number.
 *
 * @param {string} phone - The recipient's phone number in the format `254...`.
 * @param {number} amount - The amount of money to be charged.
 * @returns {Promise<any>} A promise that resolves with the response data from the
 * Safaricom API, which includes the `CheckoutRequestID`.
 * @throws {Error} If the STK push response from Safaricom is invalid or missing the `CheckoutRequestID`.
 */
export async function sendStkPush(phone: string, amount: number) {
  const timestamp = getTimestamp();
  const password = Buffer.from(
    getEnv('BUSINESS_SHORT_CODE') +
      getEnv('PASS_KEY') +
      timestamp
  ).toString('base64');

  const url = `${getEnv('MPESA_BASE_URL')}/mpesa/stkpush/v1/processrequest`;
  const callbackUrl = `${getEnv('CALLBACK_URL')}/mpesa/stkPushCallback/test123`;

  console.log(`🌐 Base URL: ${url}`);
  console.log(`🌐 Callback URL: ${callbackUrl}`);

  // Get OAuth token
  const creds = Buffer.from(
    `${getEnv('SAFARICOM_CONSUMER_KEY')}:${getEnv('SAFARICOM_CONSUMER_SECRET')}`
  ).toString('base64');

  const { data: tokenRes } = await axios.get(
    `${getEnv('MPESA_BASE_URL')}/oauth/v1/generate?grant_type=client_credentials`,
    { headers: { Authorization: `Basic ${creds}` } }
  );

  const token = tokenRes.access_token;

  // Send STK Push
  const res = await axios.post(
    url,
    {
      BusinessShortCode: getEnv('BUSINESS_SHORT_CODE'),
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phone,
      PartyB: getEnv('BUSINESS_SHORT_CODE'),
      PhoneNumber: phone,
      CallBackURL: callbackUrl,
      AccountReference: 'TelegramBot',
      TransactionDesc: 'Subscription Payment',
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log('📤 STK Push API Response:', res.data);

  if (!res.data.CheckoutRequestID) {
    throw new Error('Invalid STK Push response');
  }

  return res.data;
}
