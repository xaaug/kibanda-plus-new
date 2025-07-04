import axios from 'axios';
import moment from 'moment';
import { env } from '../config/env';

const DARAJA_BASE_URL = 'https://sandbox.safaricom.co.ke';

export async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(`${env.CONSUMER_KEY}:${env.CONSUMER_SECRET}`).toString('base64');
  console.log('Requesting access token from Daraja...');

  try {
    const res = await axios.get(`${DARAJA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    console.log('Access token retrieved.');
    console.debug('Access token:', res.data.access_token);
    return res.data.access_token;
  } catch (error) {
    console.error('Failed to retrieve access token:', error);
    throw error;
  }
}

function getPassword(timestamp: string): string {
  const data = env.SHORTCODE + env.PASSKEY + timestamp;
  const encoded = Buffer.from(data).toString('base64');
  console.debug('Generated password:', encoded);
  return encoded;
}

export async function sendStkPush(phone: string, amount: number, accountReference: string = 'KibandaPlus') {
  const timestamp = moment().format('YYYYMMDDHHmmss');
  console.log(`Preparing STK Push: phone=${phone}, amount=${amount}, time=${timestamp}`);

  try {
    const token = await getAccessToken();
    const password = getPassword(timestamp);

    const payload = {
      BusinessShortCode: env.SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phone,
      PartyB: env.SHORTCODE,
      PhoneNumber: phone,
      CallBackURL: env.CALLBACK_URL,
      AccountReference: accountReference,
      TransactionDesc: 'Kibanda Plus Subscription',
    };

    console.debug('Sending STK Push payload:', payload);

    const response = await axios.post(
      `${DARAJA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('STK Push request sent.');
    console.debug('STK Push response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error during STK Push request:', error);
    throw error;
  }
}
