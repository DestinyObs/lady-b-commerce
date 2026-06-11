import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { uploadSingle } from '../middlewares/upload.middleware';
import { updateProfileSchema, createAddressSchema, updateAddressSchema, updateSettingsSchema } from '../schemas/account.schema';
import {
  getProfile, updateProfile, uploadAvatar,
  getAccountSettings, updateAccountSettings,
  getAccountDashboard,
  getAddresses, createAddress, getAddress, updateAddress, deleteAddress, setDefaultAddress,
  getWishlist, addToWishlist, removeFromWishlist, checkWishlistItem,
  getAccountOrders, getAccountOrder,
  getPaymentMethods, createSetupIntent, deletePaymentMethod,
  getInvoices,
} from '../controllers/account.controller';

const router = Router();

// All account routes require authentication
router.use(authenticate);

// Profile
router.get('/profile', getProfile);
router.patch('/profile', validate(updateProfileSchema), updateProfile);
router.post('/avatar', uploadSingle, uploadAvatar);

// Dashboard
router.get('/dashboard', getAccountDashboard);

// Settings
router.get('/settings', getAccountSettings);
router.patch('/settings', validate(updateSettingsSchema), updateAccountSettings);

// Addresses
router.get('/addresses', getAddresses);
router.post('/addresses', validate(createAddressSchema), createAddress);
router.get('/addresses/:id', getAddress);
router.patch('/addresses/:id', validate(updateAddressSchema), updateAddress);
router.delete('/addresses/:id', deleteAddress);
router.patch('/addresses/:id/default', setDefaultAddress);

// Wishlist
router.get('/wishlist', getWishlist);
router.post('/wishlist', addToWishlist);
router.delete('/wishlist/:itemId', removeFromWishlist);
router.get('/wishlist/check/:productId', checkWishlistItem);

// Orders
router.get('/orders', getAccountOrders);
router.get('/orders/:id', getAccountOrder);

// Payment methods
router.get('/payment-methods', getPaymentMethods);
router.post('/payment-methods/setup-intent', createSetupIntent);
router.delete('/payment-methods/:id', deletePaymentMethod);

// Invoices
router.get('/invoices', getInvoices);

export default router;
