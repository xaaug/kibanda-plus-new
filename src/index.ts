import './config/loadEnv'; 

import mongoose from 'mongoose';
import setupBot from './bot/index';
import { env } from './config/env'; 
import { bot } from './bot/instance';
import { startMpesaServer } from './bot/mpesa/mpesaServer';

setupBot(bot);

console.log('🔍 Env test:', {
  SHORTCODE: process.env.BUSINESS_SHORT_CODE,
  DB: process.env.MONGO_URI?.substring(0, 20),
});


console.log('🔌 Connecting to MongoDB...');
mongoose.connect(env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    return bot.launch();
  })
  .then(() => {
    console.log('🚀 Kibanda Plus is live');

    // Start M-Pesa Express API server
    startMpesaServer();
  })
  .catch((err) => {
    console.error('❌ Failed to start:', err.message);
  });