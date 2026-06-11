import { Request, Response, NextFunction } from 'express';
import { PaymentStatus, PaymentProvider, OrderStatus } from '@prisma/client';
import { stripe, verifyStripeWebhook } from '../config/stripe';
import { createPayPalOrder, capturePayPalOrder } from '../config/paypal';
import { prisma } from '../config/database';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../middlewares/auth.middleware';
import { logger } from '../utils/logger';
import { sendOrderConfirmation } from '../utils/email';

export async function createStripePaymentIntent(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { orderId } = req.body;

    const order = await prisma.order.findFirst({
      where: { id: orderId, userId: req.user!.id },
      include: { user: true },
    });

    if (!order) { sendError(res, 'Order not found', 404); return; }
    if (order.status !== OrderStatus.PENDING) {
      sendError(res, 'Order cannot be paid in its current state', 400);
      return;
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(order.total) * 100),
      currency: order.currency.toLowerCase(),
      metadata: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        userId: order.userId,
      },
      receipt_email: order.user.email,
    });

    await prisma.payment.create({
      data: {
        orderId: order.id,
        provider: PaymentProvider.STRIPE,
        status: PaymentStatus.PENDING,
        amount: order.total,
        currency: order.currency,
        providerPaymentId: paymentIntent.id,
      },
    });

    sendSuccess(res, {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    next(error);
  }
}

export async function stripeWebhook(req: Request, res: Response): Promise<void> {
  const signature = req.headers['stripe-signature'] as string;

  let event;
  try {
    event = verifyStripeWebhook(req.body as Buffer, signature);
  } catch (err) {
    logger.error('Stripe webhook signature verification failed', { err });
    res.status(400).send('Webhook signature verification failed');
    return;
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object as unknown as { id: string; metadata: { orderId: string; userId: string }; amount: number };
        await prisma.$transaction([
          prisma.payment.updateMany({
            where: { providerPaymentId: pi.id },
            data: { status: PaymentStatus.CAPTURED, capturedAt: new Date() },
          }),
          prisma.order.update({
            where: { id: pi.metadata.orderId },
            data: { status: OrderStatus.CONFIRMED },
          }),
        ]);

        const order = await prisma.order.findUnique({
          where: { id: pi.metadata.orderId },
          include: { user: true },
        });
        if (order) {
          await sendOrderConfirmation(
            order.user.email,
            order.user.firstName,
            order.orderNumber,
            `$${order.total}`,
          ).catch(() => {});
        }
        break;
      }
      case 'payment_intent.payment_failed': {
        const pi = event.data.object as { id: string; last_payment_error?: { message?: string } };
        await prisma.payment.updateMany({
          where: { providerPaymentId: pi.id },
          data: {
            status: PaymentStatus.FAILED,
            failedAt: new Date(),
            errorMessage: pi.last_payment_error?.message,
          },
        });
        break;
      }
    }
    res.json({ received: true });
  } catch (error) {
    logger.error('Stripe webhook processing error', { error, eventType: event.type });
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}

export async function createPayPalOrderHandler(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { orderId } = req.body;

    const order = await prisma.order.findFirst({
      where: { id: orderId, userId: req.user!.id },
    });

    if (!order) { sendError(res, 'Order not found', 404); return; }

    const paypalOrder = await createPayPalOrder(
      order.total.toString(),
      order.currency,
    );

    await prisma.payment.create({
      data: {
        orderId: order.id,
        provider: PaymentProvider.PAYPAL,
        status: PaymentStatus.PENDING,
        amount: order.total,
        currency: order.currency,
        providerOrderId: paypalOrder.id,
      },
    });

    sendSuccess(res, { orderId: paypalOrder.id, approveUrl: paypalOrder.links?.find((l: { rel: string; href: string }) => l.rel === 'approve')?.href });
  } catch (error) {
    next(error);
  }
}

export async function capturePayPalOrderHandler(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { paypalOrderId, orderId } = req.body;

    const capture = await capturePayPalOrder(paypalOrderId);

    if (capture.status === 'COMPLETED') {
      await prisma.$transaction([
        prisma.payment.updateMany({
          where: { providerOrderId: paypalOrderId },
          data: {
            status: PaymentStatus.CAPTURED,
            capturedAt: new Date(),
            metadata: capture,
          },
        }),
        prisma.order.update({
          where: { id: orderId },
          data: { status: OrderStatus.CONFIRMED },
        }),
      ]);
    }

    sendSuccess(res, capture, 'Payment captured');
  } catch (error) {
    next(error);
  }
}
