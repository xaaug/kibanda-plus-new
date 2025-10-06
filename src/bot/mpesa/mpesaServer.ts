

import express from 'express';
import cors from 'cors';
import mpesaRoutes from './routes/stk.routes';
import { env } from '../../config/env';

/**
 * Starts the Express server to handle M-Pesa callbacks.
 *
 * This function sets up an Express server with CORS enabled, JSON body parsing,
 * and the M-Pesa routes. It also includes a basic health check endpoint.
 * The server listens on the port specified by the environment variables.
 */
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
