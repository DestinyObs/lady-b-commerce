import { Router } from 'express';
import {
  createStripePaymentIntent,
  stripeWebhook,
  createPayPalOrderHandler,
  capturePayPalOrderHandler,
} from '../controllers/payment.controller';
import { authenticate } from '../middlewares/auth.middleware';
import express from 'express';

const router = Router();

router.post('/stripe/create-payment-intent', authenticate, createStripePaymentIntent);
router.post('/stripe/webhook', express.raw({ type: 'application/json' }), stripeWebhook);
router.post('/paypal/create-order', authenticate, createPayPalOrderHandler);
router.post('/paypal/capture-order', authenticate, capturePayPalOrderHandler);

export default router;
