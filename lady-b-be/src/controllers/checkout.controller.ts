import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { sendSuccess, sendCreated, sendError, sendNotFound } from '../utils/response';
import { AuthRequest } from '../middlewares/auth.middleware';

const SHIPPING_METHODS = [
  {
    id: 'standard',
    name: 'Standard Shipping',
    description: '5–7 business days',
    price: 1299,
    freeThreshold: 25000,
    estimatedDays: '5–7',
  },
  {
    id: 'express',
    name: 'Express Shipping',
    description: '2–3 business days',
    price: 2999,
    freeThreshold: null,
    estimatedDays: '2–3',
  },
  {
    id: 'overnight',
    name: 'Overnight Shipping',
    description: 'Next business day',
    price: 5999,
    freeThreshold: null,
    estimatedDays: '1',
  },
];

export async function getShippingMethods(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    sendSuccess(res, { methods: SHIPPING_METHODS }, 'Shipping methods retrieved');
  } catch (err) { next(err); }
}

export async function createPaymentIntent(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { items, shippingAddress, shippingMethodId, couponCode } = req.body as {
      items: { productId: string; variantId?: string; quantity: number }[];
      shippingAddress: Record<string, string>;
      shippingMethodId?: string;
      couponCode?: string;
    };

    if (!items || items.length === 0) {
      sendError(res, 'No items provided', 400);
      return;
    }

    const shippingMethod = SHIPPING_METHODS.find((m) => m.id === (shippingMethodId ?? 'standard')) ?? SHIPPING_METHODS[0];

    // Validate and price items
    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, deletedAt: null, status: 'ACTIVE' },
      select: { id: true, name: true, price: true, isMadeToOrder: true },
    });

    // All monetary values kept in DOLLARS (consistent with DB product prices).
    // Only Stripe receives cents (multiply by 100 at the end).
    let subtotal = 0;
    const lineItems: { productId: string; variantId?: string; name: string; price: number; quantity: number }[] = [];

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) { sendError(res, `Product ${item.productId} not found or unavailable`, 400); return; }

      let price = Number(product.price); // dollars (e.g. 485.00)
      if (item.variantId) {
        const variant = await prisma.productVariant.findFirst({
          where: { id: item.variantId, productId: item.productId, isAvailable: true },
        });
        if (variant) price = Number(variant.price); // dollars
      }

      subtotal += price * item.quantity; // dollars
      lineItems.push({ productId: item.productId, variantId: item.variantId, name: product.name, price, quantity: item.quantity });
    }

    // Shipping prices are stored in cents in SHIPPING_METHODS — convert to dollars here.
    const freeThresholdDollars = shippingMethod.freeThreshold !== null
      ? shippingMethod.freeThreshold / 100
      : null;
    const shippingCost = (freeThresholdDollars !== null && subtotal >= freeThresholdDollars)
      ? 0
      : shippingMethod.price / 100; // dollars

    // Coupon discount (all in dollars)
    let discountAmount = 0;
    let couponId: string | undefined;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
      if (coupon && coupon.isActive && (!coupon.expiresAt || coupon.expiresAt > new Date())) {
        couponId = coupon.id;
        if (coupon.discountType === 'PERCENTAGE') {
          discountAmount = (subtotal * Number(coupon.discountValue)) / 100; // dollars
          if (coupon.maximumDiscount) discountAmount = Math.min(discountAmount, Number(coupon.maximumDiscount));
        } else if (coupon.discountType === 'FIXED_AMOUNT') {
          discountAmount = Math.min(Number(coupon.discountValue), subtotal); // dollars
        } else if (coupon.discountType === 'FREE_SHIPPING') {
          discountAmount = shippingCost; // dollars
        }
      }
    }

    const total = Math.max(0, subtotal - discountAmount + shippingCost); // dollars

    const { stripe } = await import('../config/stripe');

    const orderNumber = `LB-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: req.user!.id,
        status: 'PENDING',
        subtotal,        // dollars, consistent with product prices
        discountAmount,  // dollars
        shippingCost,    // dollars
        taxAmount: 0,
        total,           // dollars
        currency: 'USD',
        couponId,
        shippingCarrier: shippingMethod.name,
        items: {
          create: lineItems.map((item) => ({
            productId: item.productId,
            variantId: item.variantId ?? undefined,
            productName: item.name,
            quantity: item.quantity,
            unitPrice: item.price,
            totalPrice: item.price * item.quantity,
          })),
        },
      },
    });

    const amountInCents = Math.round(total * 100);

    const intent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      metadata: { orderId: order.id, userId: req.user!.id },
      automatic_payment_methods: { enabled: true },
    });

    await prisma.payment.create({
      data: {
        orderId: order.id,
        provider: 'STRIPE',
        amount: total,     // dollars (matches order)
        currency: 'USD',
        status: 'PENDING',
        providerPaymentId: intent.id,
      },
    });

    sendCreated(res, {
      clientSecret: intent.client_secret,
      orderId: order.id,
      amount: total,
    }, 'Payment intent created');
  } catch (err) { next(err); }
}

export async function confirmOrder(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { orderId, paymentIntentId } = req.body as { orderId: string; paymentIntentId: string };

    const order = await prisma.order.findFirst({
      where: { id: orderId, userId: req.user!.id },
    });
    if (!order) { sendNotFound(res, 'Order'); return; }

    const { stripe } = await import('../config/stripe');
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (intent.status !== 'succeeded') {
      sendError(res, 'Payment has not been confirmed yet', 400);
      return;
    }

    await prisma.$transaction([
      prisma.order.update({
        where: { id: orderId },
        data: { status: 'CONFIRMED' },
      }),
      prisma.payment.updateMany({
        where: { orderId, providerPaymentId: paymentIntentId },
        data: { status: 'CAPTURED', capturedAt: new Date() },
      }),
    ]);

    // Clear the cart
    await prisma.cart.deleteMany({ where: { userId: req.user!.id } });

    const confirmedOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { product: { select: { name: true, slug: true } } } },
      },
    });

    sendSuccess(res, { order: confirmedOrder }, 'Order confirmed');
  } catch (err) { next(err); }
}
