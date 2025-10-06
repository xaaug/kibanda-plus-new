import request from 'request';
import { Request, Response, NextFunction } from 'express';

/**
 * Express middleware to generate and attach a Safaricom API access token.
 *
 * This middleware sends a request to the Safaricom OAuth endpoint to get a new
 * access token using the consumer key and secret from the environment variables.
 * The token is then attached to the request object (`req.safaricom_access_token`)
 * before passing control to the next middleware in the stack.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function.
 */
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

        // Add the access token to the request object for use in subsequent middleware/handlers
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
