import { Router } from 'express';
import { getJournalPosts, getJournalPost } from '../controllers/journal.controller';

const router = Router();

router.get('/', getJournalPosts);
router.get('/:slug', getJournalPost);

export default router;
