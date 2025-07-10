

import express from 'express';
import cors from 'cors';
import mpesaRoutes from './routes/stk.routes';
import { env } from '../../config/env';

export function startMpesaServer() {
  const app = express();

  // Enable CORS for all origins (you can restrict this in prod)
  app.use(cors());

  // Ensure M-Pesa callback body is parsed
  app.use(express.json({ limit: '1mb' }));

  // Basic health check
  app.get('/', (req, res) => {
    res.send('✅ Mpesa Server is up and running!');
  });

  // Main route
  app.use('/mpesa', mpesaRoutes);

  // Use Render/Heroku port if available, else fallback
  const PORT = process.env.PORT || env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`📡 Mpesa Express API server running on port ${PORT}`);
  });
}

startMpesaServer();
