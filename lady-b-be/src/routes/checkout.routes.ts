import { Router } from 'express';
import { getShippingMethods, createPaymentIntent, confirmOrder } from '../controllers/checkout.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/shipping-methods', getShippingMethods);
router.post('/create-payment-intent', authenticate, createPaymentIntent);
router.post('/confirm', authenticate, confirmOrder);

export default router;
