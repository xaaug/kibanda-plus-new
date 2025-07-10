import axios from 'axios';
import { getTimestamp } from '../bot/mpesa/utils/timestamp.util';
import { getEnv } from '../config/validateEnv';

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

  const creds = Buffer.from(
    `${getEnv('SAFARICOM_CONSUMER_KEY')}:${getEnv('SAFARICOM_CONSUMER_SECRET')}`
  ).toString('base64');

  const { data: tokenRes } = await axios.get(
    `${getEnv('MPESA_BASE_URL')}/oauth/v1/generate?grant_type=client_credentials`,
    { headers: { Authorization: `Basic ${creds}` } }
  );

  const token = tokenRes.access_token;

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
