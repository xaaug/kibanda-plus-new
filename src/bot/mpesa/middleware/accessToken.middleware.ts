import request from 'request';
import { Request, Response, NextFunction } from 'express';

export const accessToken = (req: Request, res: Response, next: NextFunction) => {
  const url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";

  console.log('✅ Key:', process.env.SAFARICOM_CONSUMER_KEY);
console.log('✅ Secret:', process.env.SAFARICOM_CONSUMER_SECRET);


  const auth = Buffer.from(
    `${process.env.SAFARICOM_CONSUMER_KEY}:${process.env.SAFARICOM_CONSUMER_SECRET}`
  ).toString('base64');

  console.log('🔐 Safaricom Auth Header:', auth);


  request(
    {
      url,
      headers: {
        Authorization: `Basic ${auth}`,
      },
    },
    (error, response, body) => {
      if (error) {
        return res.status(500).json({
          message: '❌ Failed to generate access token',
          error: error.message,
        });
      }

      try {
        const parsed = JSON.parse(body);
        if (!parsed.access_token) {
          throw new Error('No access_token found in response');
        }

        // TEMPORARY FIX for TypeScript error
        (req as any).safaricom_access_token = parsed.access_token;

        next();
      } catch (err) {
        console.error('❌ Error parsing Safaricom token response:', body);
        res.status(500).json({
          message: '❌ Invalid token response from Safaricom',
          error: err instanceof Error ? err.message : err,
        });
      }
    }
  );
};
