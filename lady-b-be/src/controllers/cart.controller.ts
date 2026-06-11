import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { sendSuccess, sendNotFound, sendError } from '../utils/response';
import { AuthRequest } from '../middlewares/auth.middleware';

async function getOrCreateCart(userId?: string, sessionId?: string) {
  if (!userId && !sessionId) return null;

  const where = userId ? { userId } : { sessionId };

  let cart = await prisma.cart.findFirst({
    where,
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true, name: true, slug: true, price: true, status: true,
              images: { where: { isPrimary: true }, take: 1 },
            },
          },
          variant: true,
        },
      },
      coupon: true,
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { ...(userId ? { userId } : { sessionId }) },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true, name: true, slug: true, price: true, status: true,
                images: { where: { isPrimary: true }, take: 1 },
              },
            },
            variant: true,
          },
        },
        coupon: true,
      },
    });
  }

  return cart;
}

export async function getCart(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user?.id;
    const sessionId = req.headers['x-session-id'] as string;
    const cart = await getOrCreateCart(userId, sessionId);
    sendSuccess(res, cart);
  } catch (error) {
    next(error);
  }
}

export async function addToCart(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { productId, variantId, quantity = 1 } = req.body;
    const userId = req.user?.id;
    const sessionId = req.headers['x-session-id'] as string;

    if (!userId && !sessionId) {
      sendError(res, 'Session ID required for guest cart', 400);
      return;
    }

    const product = await prisma.product.findFirst({
      where: { id: productId, deletedAt: null, status: 'ACTIVE' },
    });
    if (!product) { sendNotFound(res, 'Product'); return; }

    const price = variantId
      ? (await prisma.productVariant.findUnique({ where: { id: variantId } }))?.price ?? product.price
      : product.price;

    const cart = await getOrCreateCart(userId, sessionId);
    if (!cart) { sendError(res, 'Could not create cart', 500); return; }

    const existing = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId, variantId: variantId ?? null },
    });

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: { cartId: cart.id, productId, variantId, quantity, price },
      });
    }

    const updatedCart = await getOrCreateCart(userId, sessionId);
    sendSuccess(res, updatedCart, 'Item added to cart');
  } catch (error) {
    next(error);
  }
}

export async function updateCartItem(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      await prisma.cartItem.delete({ where: { id } });
      sendSuccess(res, null, 'Item removed from cart');
      return;
    }

    await prisma.cartItem.update({ where: { id }, data: { quantity } });
    const userId = req.user?.id;
    const sessionId = req.headers['x-session-id'] as string;
    const cart = await getOrCreateCart(userId, sessionId);
    sendSuccess(res, cart, 'Cart updated');
  } catch (error) {
    next(error);
  }
}

export async function removeCartItem(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    await prisma.cartItem.delete({ where: { id } });
    const userId = req.user?.id;
    const sessionId = req.headers['x-session-id'] as string;
    const cart = await getOrCreateCart(userId, sessionId);
    sendSuccess(res, cart, 'Item removed from cart');
  } catch (error) {
    next(error);
  }
}

export async function clearCart(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user?.id;
    const sessionId = req.headers['x-session-id'] as string;
    const where = userId ? { userId } : { sessionId };
    const cart = await prisma.cart.findFirst({ where });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
    sendSuccess(res, null, 'Cart cleared');
  } catch (error) {
    next(error);
  }
}
