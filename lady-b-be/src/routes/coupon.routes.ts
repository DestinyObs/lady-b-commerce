import { Router } from 'express';
import { validateCoupon } from '../controllers/coupon.controller';
import { validate } from '../middlewares/validate.middleware';
import { validateCouponSchema } from '../schemas/coupon.schema';

const router = Router();

// Public coupon validation — optionally enriched by auth context
router.post('/validate', validate(validateCouponSchema), validateCoupon);

export default router;
