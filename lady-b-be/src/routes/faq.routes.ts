import { Router } from 'express';
import { getFaqs } from '../controllers/faq.controller';

const router = Router();

router.get('/', getFaqs);

export default router;
