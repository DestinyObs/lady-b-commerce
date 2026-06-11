import { Router } from 'express';
import {
  getDashboard, getSalesAnalytics, getAuditLogs, getAdminSettings, updateAdminSettings,
  // Users
  adminGetUsers, adminGetUser, adminUpdateUser, adminDeleteUser,
  // Products
  adminGetProducts, adminGetProduct, adminUpdateProductStock,
  adminAddProductImages, adminUpdateProductImage, adminDeleteProductImage,
  adminGetProductVariants, adminCreateProductVariant, adminUpdateProductVariant, adminDeleteProductVariant,
  // Categories
  adminGetCategories, adminCreateCategory, adminUpdateCategory, adminDeleteCategory,
  // Collections
  adminGetCollections, adminCreateCollection, adminGetCollection, adminUpdateCollection, adminDeleteCollection,
  adminAddProductToCollection, adminRemoveProductFromCollection,
  // Coupons
  adminGetCoupons, adminCreateCoupon, adminGetCoupon, adminUpdateCoupon, adminDeleteCoupon,
  // Newsletter
  adminGetSubscribers, adminDeleteSubscriber, adminBroadcastNewsletter, adminExportSubscribers,
  // Wholesale & Press
  adminGetWholesaleInquiries, adminUpdateWholesaleStatus,
  adminGetPressInquiries, adminUpdatePressStatus,
  // Contact
  adminReplyContactMessage, adminDeleteContactMessage,
  // Reviews
  adminDeleteReview,
  // Inventory
  adminGetInventory, adminGetInventoryLogs,
} from '../controllers/admin.controller';
import {
  adminGetOrders, adminGetOrder, updateOrderStatus, updateOrderTracking,
} from '../controllers/order.controller';
import {
  adminGetCustomOrders, adminGetCustomOrder, updateCustomOrderStatus, sendQuote, rejectCustomOrder,
} from '../controllers/custom-order.controller';
import {
  approveReview, rejectReview, adminGetReviews,
} from '../controllers/review.controller';
import {
  adminGetPosts, adminGetPost, adminCreatePost, adminUpdatePost, adminDeletePost,
  adminPublishPost, adminUnpublishPost,
} from '../controllers/journal.controller';
import {
  adminGetGiftCards, adminGetGiftCard, adminUpdateGiftCard,
} from '../controllers/gift-cards.controller';
import {
  adminGetFaqs, adminCreateFaq, adminUpdateFaq, adminDeleteFaq,
} from '../controllers/faq.controller';
import {
  adminGetContactMessages, adminMarkContactRead,
} from '../controllers/contact.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { uploadMultiple } from '../middlewares/upload.middleware';
import { createCollectionSchema, updateCollectionSchema } from '../schemas/collection.schema';
import { createCouponSchema, updateCouponSchema } from '../schemas/coupon.schema';
import { createVariantSchema } from '../schemas/product.schema';
import { updateOrderStatusSchema, updateTrackingSchema } from '../schemas/order.schema';
import { sendQuoteSchema, updateCustomOrderStatusSchema } from '../schemas/custom-order.schema';

const router = Router();

router.use(authenticate, requireAdmin);

// ── Core dashboard / analytics ────────────────────────────────────────────────
router.get('/dashboard', getDashboard);
router.get('/analytics/sales', getSalesAnalytics);
router.get('/audit-logs', getAuditLogs);
router.get('/settings', getAdminSettings);
router.patch('/settings', updateAdminSettings);

// ── Users / Customers ─────────────────────────────────────────────────────────
router.get('/users', adminGetUsers);
router.get('/users/:id', adminGetUser);
router.patch('/users/:id', adminUpdateUser);
router.delete('/users/:id', adminDeleteUser);
router.get('/customers', adminGetUsers);
router.patch('/customers/:id', adminUpdateUser);

// ── Orders ────────────────────────────────────────────────────────────────────
router.get('/orders', adminGetOrders);
router.get('/orders/:id', adminGetOrder);
router.patch('/orders/:id/status', validate(updateOrderStatusSchema), updateOrderStatus);
router.patch('/orders/:id/tracking', validate(updateTrackingSchema), updateOrderTracking);

// ── Custom Orders ─────────────────────────────────────────────────────────────
router.get('/custom-orders', adminGetCustomOrders);
router.get('/custom-orders/:id', adminGetCustomOrder);
router.patch('/custom-orders/:id/status', validate(updateCustomOrderStatusSchema), updateCustomOrderStatus);
router.post('/custom-orders/:id/quote', validate(sendQuoteSchema), sendQuote);
router.post('/custom-orders/:id/reject', rejectCustomOrder);

// ── Products ──────────────────────────────────────────────────────────────────
router.get('/products', adminGetProducts);
router.get('/products/:id', adminGetProduct);
router.patch('/products/:id/stock', adminUpdateProductStock);
router.post('/products/:id/images', uploadMultiple, adminAddProductImages);
router.patch('/products/:id/images/:imageId', adminUpdateProductImage);
router.delete('/products/:id/images/:imageId', adminDeleteProductImage);
router.get('/products/:id/variants', adminGetProductVariants);
router.post('/products/:id/variants', validate(createVariantSchema), adminCreateProductVariant);
router.patch('/products/:id/variants/:variantId', adminUpdateProductVariant);
router.delete('/products/:id/variants/:variantId', adminDeleteProductVariant);
router.get('/products/:id/inventory-logs', adminGetInventoryLogs);

// ── Categories ────────────────────────────────────────────────────────────────
router.get('/categories', adminGetCategories);
router.post('/categories', adminCreateCategory);
router.patch('/categories/:id', adminUpdateCategory);
router.delete('/categories/:id', adminDeleteCategory);

// ── Collections ───────────────────────────────────────────────────────────────
router.get('/collections', adminGetCollections);
router.post('/collections', validate(createCollectionSchema), adminCreateCollection);
router.get('/collections/:id', adminGetCollection);
router.patch('/collections/:id', validate(updateCollectionSchema), adminUpdateCollection);
router.delete('/collections/:id', adminDeleteCollection);
router.post('/collections/:id/products', adminAddProductToCollection);
router.delete('/collections/:id/products/:productId', adminRemoveProductFromCollection);

// ── Coupons ───────────────────────────────────────────────────────────────────
router.get('/coupons', adminGetCoupons);
router.post('/coupons', validate(createCouponSchema), adminCreateCoupon);
router.get('/coupons/:id', adminGetCoupon);
router.patch('/coupons/:id', validate(updateCouponSchema), adminUpdateCoupon);
router.delete('/coupons/:id', adminDeleteCoupon);

// ── Reviews ───────────────────────────────────────────────────────────────────
router.get('/reviews', adminGetReviews);
router.patch('/reviews/:id/approve', approveReview);
router.patch('/reviews/:id/reject', rejectReview);
router.delete('/reviews/:id', adminDeleteReview);

// ── Newsletter ────────────────────────────────────────────────────────────────
router.get('/newsletter', adminGetSubscribers);
router.delete('/newsletter/:id', adminDeleteSubscriber);
router.post('/newsletter/broadcast', adminBroadcastNewsletter);
router.get('/newsletter/export', adminExportSubscribers);

// ── Wholesale & Press ─────────────────────────────────────────────────────────
router.get('/wholesale', adminGetWholesaleInquiries);
router.patch('/wholesale/:id', adminUpdateWholesaleStatus);
router.get('/press', adminGetPressInquiries);
router.patch('/press/:id', adminUpdatePressStatus);

// ── Contact ───────────────────────────────────────────────────────────────────
router.get('/contact-messages', adminGetContactMessages);
router.patch('/contact-messages/:id', adminMarkContactRead);
router.post('/contact-messages/:id/reply', adminReplyContactMessage);
router.delete('/contact-messages/:id', adminDeleteContactMessage);

// ── Journal (CMS) ─────────────────────────────────────────────────────────────
router.get('/journal', adminGetPosts);
router.post('/journal', adminCreatePost);
router.get('/journal/:id', adminGetPost);
router.patch('/journal/:id', adminUpdatePost);
router.delete('/journal/:id', adminDeletePost);
router.patch('/journal/:id/publish', adminPublishPost);
router.patch('/journal/:id/unpublish', adminUnpublishPost);

// ── Gift Cards ────────────────────────────────────────────────────────────────
router.get('/gift-cards', adminGetGiftCards);
router.get('/gift-cards/:id', adminGetGiftCard);
router.patch('/gift-cards/:id', adminUpdateGiftCard);

// ── FAQ ───────────────────────────────────────────────────────────────────────
router.get('/faqs', adminGetFaqs);
router.post('/faqs', adminCreateFaq);
router.patch('/faqs/:id', adminUpdateFaq);
router.delete('/faqs/:id', adminDeleteFaq);

// ── Inventory ─────────────────────────────────────────────────────────────────
router.get('/inventory', adminGetInventory);

export default router;
