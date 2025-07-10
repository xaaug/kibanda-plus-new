// src/mpesaServer.ts
import express from 'express';
import cors from 'cors';
import mpesaRoutes from './routes/stk.routes';
import { env } from '../../config/env';

export function startMpesaServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());

    app.get('/', (req, res) => {
      res.send('Mpesa Server!');
    });

  app.use('/mpesa', mpesaRoutes);

  app.listen(env.PORT, () => {
    console.log(`📡 Mpesa Express API server running on port ${env.PORT}`);
  });
}

startMpesaServer();
