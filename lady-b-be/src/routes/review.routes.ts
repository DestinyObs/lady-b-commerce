import { Router } from 'express';
import {
  createReview,
  getProductReviews,
  adminGetReviews,
  approveReview,
  rejectReview,
  deleteReview,
} from '../controllers/review.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/role.middleware';

const router = Router();

router.post('/', authenticate, createReview);
router.get('/product/:productId', getProductReviews);
router.get('/admin', authenticate, requireAdmin, adminGetReviews);
router.patch('/admin/:id/approve', authenticate, requireAdmin, approveReview);
router.patch('/admin/:id/reject', authenticate, requireAdmin, rejectReview);
router.delete('/:id', authenticate, deleteReview);

export default router;
