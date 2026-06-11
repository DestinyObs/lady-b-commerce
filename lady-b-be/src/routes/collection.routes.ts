import { Router } from 'express';
import { getCollections, getCollectionBySlug } from '../controllers/collection.controller';

const router = Router();

router.get('/', getCollections);
router.get('/slug/:slug', getCollectionBySlug);
router.get('/:slug', getCollectionBySlug); // convenience alias

export default router;
