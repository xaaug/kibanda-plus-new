import express from 'express';
import { accessToken } from '../middleware/accessToken.middleware';
import {
  initiateSTKPush,
  stkPushCallback,
  confirmPayment
} from '../controllers/stk.controllers';

const router = express.Router();

// Initiate STK push
router.post('/stkPush', accessToken, initiateSTKPush);

// Callback URL 
router.post('/stkPushCallback/:Order_ID', stkPushCallback);

// Confirm payment manually by CheckoutRequestID
router.post('/confirmPayment/:CheckoutRequestID', accessToken, confirmPayment);

export default router;
