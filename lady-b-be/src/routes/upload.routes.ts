import { Router } from 'express';
import { uploadSingleImage, uploadMultipleImages, deleteUploadedImage } from '../controllers/upload.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/role.middleware';
import { uploadSingle, uploadMultiple } from '../middlewares/upload.middleware';
import { uploadRateLimit } from '../middlewares/rate-limit.middleware';

const router = Router();

router.post('/image', authenticate, requireAdmin, uploadRateLimit, uploadSingle, uploadSingleImage);
router.post('/multiple', authenticate, requireAdmin, uploadRateLimit, uploadMultiple, uploadMultipleImages);
router.delete('/:publicId', authenticate, requireAdmin, deleteUploadedImage);

export default router;
