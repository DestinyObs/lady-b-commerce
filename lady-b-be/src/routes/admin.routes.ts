import { Router } from 'express';
import {
  getDashboard,
  getSalesAnalytics,
  getAuditLogs,
  getAdminSettings,
  updateAdminSettings,
} from '../controllers/admin.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/role.middleware';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/dashboard', getDashboard);
router.get('/analytics/sales', getSalesAnalytics);
router.get('/audit-logs', getAuditLogs);
router.get('/settings', getAdminSettings);
router.patch('/settings', updateAdminSettings);

export default router;
