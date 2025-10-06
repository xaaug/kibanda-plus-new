import request from 'request';
import { getTimestamp } from '../utils/timestamp.util';
import { getEnv } from '../../../config/validateEnv';

/**
 * Directly confirms a payment with the M-Pesa API by its CheckoutRequestID.
 *
 * This function performs a self-contained operation to query the status of an STK push.
 * It first obtains a new access token from Safaricom and then immediately uses it
 * to make a `stkpushquery` request. This is useful for auto-confirming payments
 * from the callback without needing to pass an access token around.
 *
 * @param {string} CheckoutRequestID - The unique ID of the checkout transaction to be queried.
 * @returns {Promise<any>} A promise that resolves with the body of the STK push query response
 * from the Safaricom API, or rejects with an error.
 */
export const confirmPaymentDirect = (CheckoutRequestID: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const timestamp = getTimestamp();
    const password = Buffer.from(
      getEnv('BUSINESS_SHORT_CODE') + getEnv('PASS_KEY') + timestamp
    ).toString('base64');

    // Get access token
    const auth = Buffer.from(
      `${getEnv('SAFARICOM_CONSUMER_KEY')}:${getEnv('SAFARICOM_CONSUMER_SECRET')}`
    ).toString('base64');

    request.get(
      {
        url: 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
        headers: {
          Authorization: `Basic ${auth}`,
        },
      },
      (err, _, body) => {
        if (err) {
          console.error('🔐 Auth Error:', err);
          return reject(err);
        }

        const access_token = JSON.parse(body).access_token;

        request.post(
          {
            url: 'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query',
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
            json: {
              BusinessShortCode: getEnv('BUSINESS_SHORT_CODE'),
              Password: password,
              Timestamp: timestamp,
              CheckoutRequestID,
            },
          },
          (err, _resp, responseBody) => {
            if (err) {
              console.error('📡 STK Query Error:', err);
              return reject(err);
            }

            resolve(responseBody);
          }
        );
      }
    );
  });
};
