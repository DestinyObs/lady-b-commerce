import { Router } from 'express';
import {
  getProducts,
  getProduct,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  publishProduct,
  archiveProduct,
  notifyWhenAvailable,
  searchProducts,
} from '../controllers/product.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createProductSchema, updateProductSchema, productQuerySchema } from '../schemas/product.schema';
import { getProductReviews } from '../controllers/review.controller';

const router = Router();

router.get('/', validate(productQuerySchema, 'query'), getProducts);
router.get('/search', searchProducts);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProduct);
router.get('/:id/reviews', getProductReviews);

router.post('/', authenticate, requireAdmin, validate(createProductSchema), createProduct);
router.patch('/:id', authenticate, requireAdmin, validate(updateProductSchema), updateProduct);
router.delete('/:id', authenticate, requireAdmin, deleteProduct);
router.patch('/:id/publish', authenticate, requireAdmin, publishProduct);
router.patch('/:id/archive', authenticate, requireAdmin, archiveProduct);
router.post('/:id/notify', notifyWhenAvailable);

export default router;
