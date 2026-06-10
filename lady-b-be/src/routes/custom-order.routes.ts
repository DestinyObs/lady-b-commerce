import { Router } from 'express';
import {
  createCustomOrder,
  uploadCustomOrderImages,
  getUserCustomOrders,
  getUserCustomOrder,
  adminGetCustomOrders,
  adminGetCustomOrder,
  sendQuote,
  approveQuote,
  rejectCustomOrder,
  updateCustomOrderStatus,
} from '../controllers/custom-order.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { uploadInspirationImages } from '../middlewares/upload.middleware';
import { createCustomOrderSchema, sendQuoteSchema, updateCustomOrderStatusSchema } from '../schemas/custom-order.schema';

const router = Router();

router.post('/', authenticate, validate(createCustomOrderSchema), createCustomOrder);
router.get('/', authenticate, getUserCustomOrders);
router.get('/:id', authenticate, getUserCustomOrder);
router.post('/:id/images', authenticate, uploadInspirationImages, uploadCustomOrderImages);
router.post('/:id/approve', authenticate, approveQuote);

router.get('/admin/list', authenticate, requireAdmin, adminGetCustomOrders);
router.get('/admin/:id', authenticate, requireAdmin, adminGetCustomOrder);
router.post('/admin/:id/quote', authenticate, requireAdmin, validate(sendQuoteSchema), sendQuote);
router.post('/admin/:id/reject', authenticate, requireAdmin, rejectCustomOrder);
router.patch('/admin/:id/status', authenticate, requireAdmin, validate(updateCustomOrderStatusSchema), updateCustomOrderStatus);

export default router;
