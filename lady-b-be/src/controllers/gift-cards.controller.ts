import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { prisma } from '../config/database';
import {
  sendSuccess, sendCreated, sendNotFound, sendError,
  sendPaginated, getPaginationParams, paginate,
} from '../utils/response';
import { sendEmail } from '../utils/email';
import { env } from '../config/env';
import { AuthRequest } from '../middlewares/auth.middleware';

function generateGiftCardCode(): string {
  return `LBGC-${crypto.randomBytes(3).toString('hex').toUpperCase()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
}

export async function purchaseGiftCard(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { amount, recipientName, recipientEmail, message, senderName } = req.body as {
      amount: number; recipientName?: string; recipientEmail?: string;
      message?: string; senderName?: string;
    };

    if (!amount || amount < 1000) {
      sendError(res, 'Minimum gift card amount is $10.00', 400);
      return;
    }

    const code = generateGiftCardCode();
    const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year

    const giftCard = await prisma.giftCard.create({
      data: {
        code,
        initialAmount: amount,
        balance: amount,
        recipientName,
        recipientEmail,
        senderName,
        message,
        expiresAt,
        purchasedByEmail: (req as AuthRequest).user?.email ?? recipientEmail,
      },
    });

    if (recipientEmail) {
      await sendEmail({
        to: recipientEmail,
        subject: `You've received a Lady B Designs Gift Card${senderName ? ` from ${senderName}` : ''}!`,
        html: `<p>Hi ${recipientName ?? 'there'},</p>
        <p>You've received a Lady B Designs gift card worth <strong>$${(amount / 100).toFixed(2)}</strong>!</p>
        ${message ? `<p><em>"${message}"</em></p>` : ''}
        <p>Your gift card code: <strong>${code}</strong></p>
        <p>Valid until: ${expiresAt.toLocaleDateString()}</p>
        <p><a href="${env.APP_URL}">Shop Lady B Designs</a></p>`,
        text: `Your Lady B gift card code is: ${code}. Value: $${(amount / 100).toFixed(2)}.`,
      }).catch(() => {});
    }

    sendCreated(res, {
      giftCard: {
        code: giftCard.code,
        amount: giftCard.initialAmount,
        expiresAt: giftCard.expiresAt,
      },
    }, 'Gift card created and sent');
  } catch (err) { next(err); }
}

export async function redeemGiftCard(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { code, orderId } = req.body as { code: string; orderId?: string };

    const giftCard = await prisma.giftCard.findUnique({ where: { code } });
    if (!giftCard || !giftCard.isActive) {
      sendError(res, 'Invalid or inactive gift card', 400);
      return;
    }
    if (giftCard.balance <= 0) {
      sendError(res, 'This gift card has no remaining balance', 400);
      return;
    }
    if (giftCard.expiresAt && giftCard.expiresAt < new Date()) {
      sendError(res, 'This gift card has expired', 400);
      return;
    }

    sendSuccess(res, {
      code: giftCard.code,
      balance: giftCard.balance,
      initialAmount: giftCard.initialAmount,
      expiresAt: giftCard.expiresAt,
    }, 'Gift card is valid');
  } catch (err) { next(err); }
}

// ─── Admin ─────────────────────────────────────────────────────────────────────

export async function adminGetGiftCards(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip } = getPaginationParams(req.query.page as string, req.query.limit as string);
    const [giftCards, total] = await Promise.all([
      prisma.giftCard.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: { redemptions: { select: { amount: true, redeemedAt: true } } },
      }),
      prisma.giftCard.count(),
    ]);
    sendPaginated(res, giftCards, paginate(page, limit, total), 'Gift cards retrieved');
  } catch (err) { next(err); }
}

export async function adminGetGiftCard(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const giftCard = await prisma.giftCard.findUnique({
      where: { id: req.params.id },
      include: { redemptions: true },
    });
    if (!giftCard) { sendNotFound(res, 'Gift card'); return; }
    sendSuccess(res, giftCard);
  } catch (err) { next(err); }
}

export async function adminUpdateGiftCard(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const giftCard = await prisma.giftCard.findUnique({ where: { id: req.params.id } });
    if (!giftCard) { sendNotFound(res, 'Gift card'); return; }
    const updated = await prisma.giftCard.update({ where: { id: req.params.id }, data: req.body });
    sendSuccess(res, updated, 'Gift card updated');
  } catch (err) { next(err); }
}
