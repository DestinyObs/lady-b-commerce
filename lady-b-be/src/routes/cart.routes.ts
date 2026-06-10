import { Router } from 'express';
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart } from '../controllers/cart.controller';
import { authenticate, optionalAuth } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', optionalAuth, getCart);
router.post('/items', optionalAuth, addToCart);
router.patch('/items/:id', optionalAuth, updateCartItem);
router.delete('/items/:id', optionalAuth, removeCartItem);
router.delete('/', optionalAuth, clearCart);

export default router;
