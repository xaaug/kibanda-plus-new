import request from 'request';
import { getTimestamp } from '../utils/timestamp.util';
import { getEnv } from '../../../config/validateEnv';


// Initializes the STK Push
export const initiateSTKPush = async (req: any, res: any) => {
  const { amount, phone, Order_ID } = req.body;

  const timestamp = getTimestamp();
  const password = Buffer.from(
    getEnv('BUSINESS_SHORT_CODE') + getEnv('PASS_KEY') + timestamp
  ).toString('base64');

  const stkCallbackUrl = `${getEnv('CALLBACK_URL')}/mpesa/stkPushCallback/${Order_ID}`;
  console.log(`🌐 Callback URL set to: ${stkCallbackUrl}`);

  const url = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';

  request.post(
    {
      url,
      headers: {
        Authorization: `Bearer ${req.safaricom_access_token}`,
      },
      json: {
        BusinessShortCode: process.env.BUSINESS_SHORT_CODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: phone,
        PartyB: process.env.BUSINESS_SHORT_CODE,
        PhoneNumber: phone,
        CallBackURL: stkCallbackUrl,
        AccountReference: 'Your App',
        TransactionDesc: 'Payment',
      },
    },
    (err, _response, body) => {
      if (err) {
        console.error('❌ STK Push Error:', err);
        return res.status(500).json({ message: 'STK Push error', err });
      }

      console.log('📤 STK Push initiated:', body);
      res.status(200).json(body);
    }
  );
};

// Checks the callback

export const stkPushCallback = async (req: any, res: any) => {
  const { Order_ID } = req.params;

  console.log(`📥 Callback received for Order_ID: ${Order_ID}`);
  console.log('📩 Raw Callback Payload:', JSON.stringify(req.body, null, 2));

  try {
    const callback = req.body.Body.stkCallback;

    if (!callback) {
      console.warn('⚠️ Missing callback data in request');
      return res.status(400).json({ message: 'Invalid callback payload' });
    }

    type CallbackItem = { Name: string; Value: string | number };
    const meta = Object.values(callback.CallbackMetadata?.Item || []) as CallbackItem[];

    const data = {
      Order_ID,
      MerchantRequestID: callback.MerchantRequestID,
      CheckoutRequestID: callback.CheckoutRequestID,
      ResultCode: callback.ResultCode,
      ResultDesc: callback.ResultDesc,
      PhoneNumber: meta.find(o => o.Name === 'PhoneNumber')?.Value,
      Amount: meta.find(o => o.Name === 'Amount')?.Value,
      MpesaReceiptNumber: meta.find(o => o.Name === 'MpesaReceiptNumber')?.Value,
      TransactionDate: meta.find(o => o.Name === 'TransactionDate')?.Value,
    };

    console.log('✅ Parsed M-Pesa Callback Data:', data);

    // TODO: Save to MongoDB 

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('❌ Error handling callback:', error);
    res.status(500).json({ success: false, message: 'Callback handling error' });
  }
};

// Payment Confirmation
export const confirmPayment = async (req: any, res: any) => {
  const timestamp = getTimestamp();
  const password = Buffer.from(
    getEnv('BUSINESS_SHORT_CODE') + getEnv('PASS_KEY') + timestamp
  ).toString('base64');

  const url = 'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query';

  request.post(
    {
      url,
      headers: {
        Authorization: `Bearer ${req.safaricom_access_token}`,
      },
      json: {
        BusinessShortCode: process.env.BUSINESS_SHORT_CODE,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: req.params.CheckoutRequestID,
      },
    },
    (error, _response, body) => {
      if (error) {
        console.error('❌ Payment confirmation error:', error);
        return res.status(500).json({ message: 'Payment confirmation failed', error });
      }

      console.log('🔎 Payment confirmation response:', body);
      res.status(200).json(body);
    }
  );
};
