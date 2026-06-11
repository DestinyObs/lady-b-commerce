import { Request, Response, NextFunction } from 'express';
import { OrderStatus } from '@prisma/client';
import { prisma } from '../config/database';
import { sendSuccess, sendCreated, sendPaginated, sendNotFound, sendError, getPaginationParams, paginate } from '../utils/response';
import { generateOrderNumber } from '../utils/slug';
import { AuthRequest } from '../middlewares/auth.middleware';
import type { CreateOrderInput, UpdateOrderStatusInput, UpdateTrackingInput, RefundOrderInput } from '../schemas/order.schema';

export async function createOrder(
  req: AuthRequest & { body: CreateOrderInput },
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user!.id;
    const { shippingAddressId, billingAddressId, couponCode, notes, giftMessage } = req.body;

    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: { items: { include: { product: true, variant: true } }, coupon: true },
    });

    if (!cart || cart.items.length === 0) {
      sendError(res, 'Cart is empty', 400);
      return;
    }

    let discountAmount = 0;
    let couponId: string | undefined;
    const appliedCouponCode = couponCode || cart.coupon?.code;

    if (appliedCouponCode) {
      const coupon = await prisma.coupon.findFirst({
        where: {
          code: appliedCouponCode,
          isActive: true,
          OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        },
      });

      // Check usage limit in application code (Prisma can't compare fields directly)
      const withinUsageLimit = !coupon?.usageLimit || coupon.usedCount < coupon.usageLimit;

      if (coupon && withinUsageLimit) {
        couponId = coupon.id;
        const subtotal = cart.items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
        discountAmount = coupon.discountType === 'PERCENTAGE'
          ? Math.min(subtotal * (Number(coupon.discountValue) / 100), coupon.maximumDiscount ? Number(coupon.maximumDiscount) : Infinity)
          : Number(coupon.discountValue);
      }
    }

    const subtotal = cart.items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
    const shippingCost = 0; // Calculated by shipping service
    const taxAmount = 0; // Calculated by tax service
    const total = Math.max(0, subtotal + shippingCost + taxAmount - discountAmount);

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId,
          shippingAddressId,
          billingAddressId,
          status: OrderStatus.PENDING,
          subtotal,
          shippingCost,
          taxAmount,
          discountAmount,
          total,
          couponId,
          couponCode: appliedCouponCode,
          notes,
          giftMessage,
          ipAddress: req.ip,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              productName: item.product.name,
              variantName: item.variant?.name,
              sku: item.variant?.sku || item.product.sku,
              imageUrl: null,
              quantity: item.quantity,
              unitPrice: item.price,
              totalPrice: Number(item.price) * item.quantity,
            })),
          },
        },
        include: { items: true },
      });

      if (couponId) {
        await tx.coupon.update({ where: { id: couponId }, data: { usedCount: { increment: 1 } } });
      }

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return newOrder;
    });

    sendCreated(res, order, 'Order created');
  } catch (error) {
    next(error);
  }
}

export async function getUserOrders(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip } = getPaginationParams(req.query.page as string, req.query.limit as string);
    const userId = req.user!.id;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        include: { items: { include: { product: { select: { id: true, name: true, images: { where: { isPrimary: true }, take: 1 } } } } }, payments: { select: { status: true, provider: true } } },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where: { userId } }),
    ]);

    sendPaginated(res, orders, paginate(page, limit, total));
  } catch (error) {
    next(error);
  }
}

export async function getUserOrder(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const order = await prisma.order.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
      include: {
        items: { include: { product: { select: { id: true, name: true, slug: true, images: { where: { isPrimary: true }, take: 1 } } }, variant: true } },
        payments: true,
        shippingAddress: true,
      },
    });
    if (!order) { sendNotFound(res, 'Order'); return; }
    sendSuccess(res, order);
  } catch (error) {
    next(error);
  }
}

export async function adminGetOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip } = getPaginationParams(req.query.page as string, req.query.limit as string);
    const { status, search } = req.query as { status?: OrderStatus; search?: string };

    const where = {
      ...(status && { status }),
      ...(search && {
        OR: [
          { orderNumber: { contains: search, mode: 'insensitive' as const } },
          { user: { email: { contains: search, mode: 'insensitive' as const } } },
        ],
      }),
    };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: { select: { id: true, email: true, firstName: true, lastName: true } },
          items: { include: { product: { select: { id: true, name: true } } } },
          payments: { select: { status: true, provider: true, amount: true } },
          shippingAddress: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where }),
    ]);

    sendPaginated(res, orders, paginate(page, limit, total));
  } catch (error) {
    next(error);
  }
}

export async function adminGetOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true, phone: true } },
        items: { include: { product: true, variant: true } },
        payments: true,
        shippingAddress: true,
      },
    });
    if (!order) { sendNotFound(res, 'Order'); return; }
    sendSuccess(res, order);
  } catch (error) {
    next(error);
  }
}

export async function updateOrderStatus(
  req: Request<{ id: string }, {}, UpdateOrderStatusInput>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { status, reason } = req.body;
    const updates: Record<string, unknown> = { status };
    if (status === OrderStatus.SHIPPED) updates.shippedAt = new Date();
    if (status === OrderStatus.DELIVERED) updates.deliveredAt = new Date();
    if (status === OrderStatus.CANCELLED) { updates.cancelledAt = new Date(); updates.cancelReason = reason; }

    const order = await prisma.order.update({ where: { id: req.params.id }, data: updates });
    sendSuccess(res, order, 'Order status updated');
  } catch (error) {
    next(error);
  }
}

export async function updateOrderTracking(
  req: Request<{ id: string }, {}, UpdateTrackingInput>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: {
        ...req.body,
        status: OrderStatus.SHIPPED,
        shippedAt: new Date(),
      },
    });
    sendSuccess(res, order, 'Tracking updated');
  } catch (error) {
    next(error);
  }
}
