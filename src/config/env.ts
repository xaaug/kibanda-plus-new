/**
 * Environment variables for the application.
 *
 * This object holds all the environment variables used by the application.
 * It's crucial to ensure that all required variables are defined in the .env file.
 *
 * @property {string} BOT_TOKEN - The token for the Telegram bot.
 * @property {string} MONGO_URI - The connection string for the MongoDB database.
 * @property {string} MPESA_BASE_URL - The base URL for the M-Pesa API. Defaults to the Safaricom sandbox URL.
 * @property {string} SAFARICOM_CONSUMER_KEY - The consumer key for the Safaricom API.
 * @property {string} SAFARICOM_CONSUMER_SECRET - The consumer secret for the Safaricom API.
 * @property {string} BUSINESS_SHORT_CODE - The business short code for M-Pesa payments.
 * @property {string} PASS_KEY - The pass key for M-Pesa API authentication.
 * @property {string} CALLBACK_URL - The URL that M-Pesa will send callback requests to.
 * @property {number} PORT - The port on which the server will run. Defaults to 3500.
 */
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
