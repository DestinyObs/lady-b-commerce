import { Router } from 'express';
import { purchaseGiftCard, redeemGiftCard } from '../controllers/gift-cards.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', purchaseGiftCard);
router.post('/redeem', authenticate, redeemGiftCard);

export default router;
