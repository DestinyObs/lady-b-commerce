import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../middlewares/auth.middleware';
import type { ValidateCouponInput } from '../schemas/coupon.schema';

export async function validateCoupon(
  req: Request<{}, {}, ValidateCouponInput>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { code, subtotal } = req.body;
    const userId = (req as AuthRequest).user?.id;

    const coupon = await prisma.coupon.findUnique({ where: { code } });

    if (!coupon || !coupon.isActive) {
      sendError(res, 'Coupon code is invalid or inactive', 400);
      return;
    }

    const now = new Date();
    if (coupon.startsAt && coupon.startsAt > now) {
      sendError(res, 'This coupon is not yet active', 400);
      return;
    }
    if (coupon.expiresAt && coupon.expiresAt < now) {
      sendError(res, 'This coupon has expired', 400);
      return;
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      sendError(res, 'This coupon has reached its usage limit', 400);
      return;
    }

    const minOrder = coupon.minimumOrderAmount ? Number(coupon.minimumOrderAmount) : 0;
    if (subtotal < minOrder) {
      sendError(res, `Minimum order of $${(minOrder / 100).toFixed(2)} required`, 400);
      return;
    }

    if (userId && coupon.perUserLimit) {
      const userUsage = await prisma.order.count({
        where: { userId, couponId: coupon.id, status: { notIn: ['CANCELLED'] } },
      });
      if (userUsage >= coupon.perUserLimit) {
        sendError(res, 'You have already used this coupon the maximum number of times', 400);
        return;
      }
    }

    // Calculate discount amount
    const discountValue = Number(coupon.discountValue);
    let discountAmount = 0;

    if (coupon.discountType === 'PERCENTAGE') {
      discountAmount = Math.round((subtotal * discountValue) / 100);
      if (coupon.maximumDiscount) {
        discountAmount = Math.min(discountAmount, Number(coupon.maximumDiscount));
      }
    } else if (coupon.discountType === 'FIXED_AMOUNT') {
      discountAmount = Math.min(discountValue, subtotal);
    } else if (coupon.discountType === 'FREE_SHIPPING') {
      discountAmount = 0; // shipping discount handled at checkout
    }

    sendSuccess(res, {
      id: coupon.id,
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue,
      discountAmount,
      minimumOrderAmount: coupon.minimumOrderAmount ? Number(coupon.minimumOrderAmount) : null,
      maximumDiscount: coupon.maximumDiscount ? Number(coupon.maximumDiscount) : null,
      applicableProducts: coupon.applicableProducts,
      applicableCategories: coupon.applicableCategories,
    }, 'Coupon is valid');
  } catch (err) {
    next(err);
  }
}
