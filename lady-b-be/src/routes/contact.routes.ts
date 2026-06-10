import { Router } from 'express';
import {
  submitContact,
  adminGetContactMessages,
  adminMarkContactRead,
  subscribeNewsletter,
  unsubscribeNewsletter,
  submitWholesaleInquiry,
  submitPressInquiry,
} from '../controllers/contact.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { contactSchema, newsletterSubscribeSchema, wholesaleInquirySchema, pressInquirySchema } from '../schemas/contact.schema';
import { contactRateLimit } from '../middlewares/rate-limit.middleware';

const router = Router();

router.post('/contact', contactRateLimit, validate(contactSchema), submitContact);
router.get('/admin/contact-messages', authenticate, requireAdmin, adminGetContactMessages);
router.patch('/admin/contact-messages/:id/read', authenticate, requireAdmin, adminMarkContactRead);

router.post('/newsletter/subscribe', validate(newsletterSubscribeSchema), subscribeNewsletter);
router.post('/newsletter/unsubscribe', unsubscribeNewsletter);

router.post('/wholesale/inquiry', contactRateLimit, validate(wholesaleInquirySchema), submitWholesaleInquiry);
router.post('/press/inquiry', contactRateLimit, validate(pressInquirySchema), submitPressInquiry);

export default router;
