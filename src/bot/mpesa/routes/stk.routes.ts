import express from 'express';
import { accessToken } from '../middleware/accessToken.middleware';
import {
  initiateSTKPush,
  stkPushCallback,
  confirmPayment,
} from '../controllers/stk.controllers';

/**
 * Express router for handling M-Pesa STK push-related routes.
 *
 * This router defines endpoints for initiating an STK push, handling the
 * callback from Safaricom, and manually confirming a payment.
 *
 * @module routes/stk
 */
const router = express.Router();

/**
 * @route POST /stkPush
 * @description Initiates an STK push to a user's phone.
 * @access Public
 * @middleware accessToken - Ensures a valid Safaricom access token is available.
 */
router.post('/stkPush', accessToken, initiateSTKPush);

/**
 * @route POST /stkPushCallback/:Order_ID
 * @description The callback URL that Safaricom will hit after a payment is processed.
 * @access Public
 */
router.post('/stkPushCallback/:Order_ID', stkPushCallback);

/**
 * @route POST /confirmPayment/:CheckoutRequestID
 * @description Manually confirms the status of a payment using its CheckoutRequestID.
 * @access Public
 * @middleware accessToken - Ensures a valid Safaricom access token is available.
 */
router.post('/confirmPayment/:CheckoutRequestID', accessToken, confirmPayment);

export default router;
