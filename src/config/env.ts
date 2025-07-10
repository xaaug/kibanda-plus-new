export const env = {
  BOT_TOKEN: process.env.BOT_TOKEN!,
  MONGO_URI: process.env.MONGO_URI!,
  MPESA_BASE_URL: process.env.MPESA_BASE_URL || 'https://sandbox.safaricom.co.ke',
    SAFARICOM_CONSUMER_KEY: process.env.SAFARICOM_CONSUMER_KEY!,
  SAFARICOM_CONSUMER_SECRET: process.env.SAFARICOM_CONSUMER_SECRET!,
  BUSINESS_SHORT_CODE: process.env.BUSINESS_SHORT_CODE!,
  PASS_KEY: process.env.PASS_KEY!,
  CALLBACK_URL: process.env.CALLBACK_URL!,
PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3500,

};
