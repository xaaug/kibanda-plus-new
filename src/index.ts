import 'dotenv/config';
import { Telegraf } from 'telegraf';
import mongoose from 'mongoose';
import setupBot from './bot/index';
import { env } from './config/env';

const bot = new Telegraf(env.BOT_TOKEN);

setupBot(bot);

console.log('🔌 Connecting to MongoDB...');
mongoose.connect(env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    return bot.launch();
  })
  .then(() => {
    console.log('🚀 Kibanda Plus is live');
  })
  .catch((err) => {
    console.error('❌ Failed to start:', err.message);
  });