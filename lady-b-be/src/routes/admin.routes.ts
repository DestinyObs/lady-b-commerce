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
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { uploadMultiple } from '../middlewares/upload.middleware';
import { createCollectionSchema, updateCollectionSchema } from '../schemas/collection.schema';
import { createCouponSchema, updateCouponSchema } from '../schemas/coupon.schema';
import { createVariantSchema } from '../schemas/product.schema';

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
// alias FE uses "customers"
router.get('/customers', adminGetUsers);
router.patch('/customers/:id', adminUpdateUser);

// ── Products ──────────────────────────────────────────────────────────────────
router.get('/products', adminGetProducts);
router.get('/products/:id', adminGetProduct);
router.patch('/products/:id/stock', adminUpdateProductStock);

// Product images
router.post('/products/:id/images', uploadMultiple, adminAddProductImages);
router.patch('/products/:id/images/:imageId', adminUpdateProductImage);
router.delete('/products/:id/images/:imageId', adminDeleteProductImage);

// Product variants
router.get('/products/:id/variants', adminGetProductVariants);
router.post('/products/:id/variants', validate(createVariantSchema), adminCreateProductVariant);
router.patch('/products/:id/variants/:variantId', adminUpdateProductVariant);
router.delete('/products/:id/variants/:variantId', adminDeleteProductVariant);

// Product inventory logs
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
router.post('/contact-messages/:id/reply', adminReplyContactMessage);
router.delete('/contact-messages/:id', adminDeleteContactMessage);

// ── Reviews ───────────────────────────────────────────────────────────────────
router.delete('/reviews/:id', adminDeleteReview);

// ── Inventory ─────────────────────────────────────────────────────────────────
router.get('/inventory', adminGetInventory);

export default router;
