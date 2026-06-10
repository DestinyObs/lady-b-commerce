import { Router } from 'express';
import {
  createOrder,
  getUserOrders,
  getUserOrder,
  adminGetOrders,
  adminGetOrder,
  updateOrderStatus,
  updateOrderTracking,
} from '../controllers/order.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createOrderSchema, updateOrderStatusSchema, updateTrackingSchema } from '../schemas/order.schema';

const router = Router();

router.post('/', authenticate, validate(createOrderSchema), createOrder);
router.get('/', authenticate, getUserOrders);
router.get('/:id', authenticate, getUserOrder);

router.get('/admin/list', authenticate, requireAdmin, adminGetOrders);
router.get('/admin/:id', authenticate, requireAdmin, adminGetOrder);
router.patch('/admin/:id/status', authenticate, requireAdmin, validate(updateOrderStatusSchema), updateOrderStatus);
router.patch('/admin/:id/tracking', authenticate, requireAdmin, validate(updateTrackingSchema), updateOrderTracking);

export default router;
