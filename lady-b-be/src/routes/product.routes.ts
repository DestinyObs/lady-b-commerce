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
} from '../controllers/product.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createProductSchema, updateProductSchema, productQuerySchema } from '../schemas/product.schema';

const router = Router();

router.get('/', validate(productQuerySchema, 'query'), getProducts);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProduct);

router.post('/', authenticate, requireAdmin, validate(createProductSchema), createProduct);
router.patch('/:id', authenticate, requireAdmin, validate(updateProductSchema), updateProduct);
router.delete('/:id', authenticate, requireAdmin, deleteProduct);
router.patch('/:id/publish', authenticate, requireAdmin, publishProduct);
router.patch('/:id/archive', authenticate, requireAdmin, archiveProduct);
router.post('/:id/notify', notifyWhenAvailable);

export default router;
