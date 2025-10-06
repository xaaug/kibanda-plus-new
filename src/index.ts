/**
 * The main entry point for the Kibanda Plus application.
 *
 * This script performs the following actions in order:
 * 1. Loads environment variables from the `.env` file.
 * 2. Sets up the Telegraf bot with all its commands and handlers.
 * 3. Connects to the MongoDB database using the connection URI from the environment variables.
 * 4. Launches the Telegram bot to start polling for updates.
 * 5. Starts the Express server to handle M-Pesa API callbacks.
 *
 * If any step in the process fails, an error is logged to the console,
 * and the application will not start.
 *
 * @module index
 */
import './config/loadEnv';

import mongoose from 'mongoose';
import setupBot from './bot/index';
import { env } from './config/env';
import { bot } from './bot/instance';
import { startMpesaServer } from './bot/mpesa/mpesaServer';

// Initialize the bot with commands and handlers
setupBot(bot);

// Optional: Log a snippet of env variables for debugging (be careful with sensitive data)
console.log('🔍 Env test:', {
  SHORTCODE: process.env.BUSINESS_SHORT_CODE,
  DB: process.env.MONGO_URI?.substring(0, 20), // Log only a portion of the URI
});

console.log('🔌 Connecting to MongoDB...');
mongoose.connect(env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    // Launch the bot after a successful database connection
    return bot.launch();
  })
  .then(() => {
    console.log('🚀 Kibanda Plus is live');
    // Start the dedicated server for M-Pesa callbacks
    startMpesaServer();
  })
  .catch((err) => {
    console.error('❌ Failed to start:', err.message);
  });