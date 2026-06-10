import { Request, Response, NextFunction } from 'express';
import { InquiryStatus } from '@prisma/client';
import { prisma } from '../config/database';
import { sendSuccess, sendCreated, sendPaginated, sendNotFound, getPaginationParams, paginate } from '../utils/response';
import { sendEmail } from '../utils/email';
import { env } from '../config/env';
import { sendNewsletterWelcome } from '../utils/email';
import type { ContactInput, NewsletterSubscribeInput, WholesaleInquiryInput, PressInquiryInput } from '../schemas/contact.schema';

export async function submitContact(
  req: Request<{}, {}, ContactInput>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const message = await prisma.contactMessage.create({ data: req.body });

    await sendEmail({
      to: env.ADMIN_EMAIL,
      subject: `New Contact Message: ${req.body.subject}`,
      html: `<p><strong>From:</strong> ${req.body.name} (${req.body.email})</p><p><strong>Message:</strong> ${req.body.message}</p>`,
    }).catch(() => {});

    sendCreated(res, { id: message.id }, 'Message received. We\'ll be in touch shortly.');
  } catch (error) {
    next(error);
  }
}

export async function adminGetContactMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip } = getPaginationParams(req.query.page as string, req.query.limit as string);
    const { status } = req.query as { status?: InquiryStatus };
    const where = { ...(status && { status }) };
    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.contactMessage.count({ where }),
    ]);
    sendPaginated(res, messages, paginate(page, limit, total));
  } catch (error) {
    next(error);
  }
}

export async function adminMarkContactRead(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const message = await prisma.contactMessage.update({
      where: { id: req.params.id },
      data: { isRead: true, readAt: new Date(), status: InquiryStatus.IN_REVIEW },
    });
    sendSuccess(res, message);
  } catch (error) {
    next(error);
  }
}

export async function subscribeNewsletter(
  req: Request<{}, {}, NewsletterSubscribeInput>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { email, firstName, source } = req.body;
    const crypto = await import('crypto');
    const unsubscribeToken = crypto.randomBytes(16).toString('hex');

    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });
    if (existing) {
      if (!existing.isActive) {
        await prisma.newsletterSubscriber.update({ where: { email }, data: { isActive: true, unsubscribedAt: null } });
        sendSuccess(res, null, 'Welcome back! You\'re resubscribed.');
      } else {
        sendSuccess(res, null, 'You\'re already subscribed.');
      }
      return;
    }

    await prisma.newsletterSubscriber.create({ data: { email, firstName, source, unsubscribeToken } });
    await sendNewsletterWelcome(email).catch(() => {});
    sendCreated(res, null, 'Successfully subscribed. Welcome to the Lady B inner circle.');
  } catch (error) {
    next(error);
  }
}

export async function unsubscribeNewsletter(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { token } = req.body;
    const subscriber = await prisma.newsletterSubscriber.findFirst({ where: { unsubscribeToken: token } });
    if (!subscriber) { sendSuccess(res, null, 'Unsubscribed successfully'); return; }
    await prisma.newsletterSubscriber.update({
      where: { id: subscriber.id },
      data: { isActive: false, unsubscribedAt: new Date() },
    });
    sendSuccess(res, null, 'You have been unsubscribed');
  } catch (error) {
    next(error);
  }
}

export async function submitWholesaleInquiry(
  req: Request<{}, {}, WholesaleInquiryInput>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const inquiry = await prisma.wholesaleInquiry.create({ data: req.body });
    await sendEmail({
      to: env.ADMIN_EMAIL,
      subject: `New Wholesale Inquiry from ${req.body.businessName}`,
      html: `<p><strong>Business:</strong> ${req.body.businessName}</p><p><strong>Contact:</strong> ${req.body.contactName} (${req.body.email})</p><p><strong>Country:</strong> ${req.body.country}</p><p><strong>Interested in:</strong> ${req.body.interestedIn}</p>`,
    }).catch(() => {});
    sendCreated(res, { id: inquiry.id }, 'Wholesale inquiry received. Our team will contact you within 5 business days.');
  } catch (error) {
    next(error);
  }
}

export async function submitPressInquiry(
  req: Request<{}, {}, PressInquiryInput>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const inquiry = await prisma.pressInquiry.create({
      data: {
        ...req.body,
        ...(req.body.deadline && { deadline: new Date(req.body.deadline) }),
      },
    });
    await sendEmail({
      to: env.ADMIN_EMAIL,
      subject: `New Press Inquiry from ${req.body.publication}`,
      html: `<p><strong>Contact:</strong> ${req.body.contactName} (${req.body.email})</p><p><strong>Publication:</strong> ${req.body.publication}</p><p><strong>Type:</strong> ${req.body.inquiryType}</p><p>${req.body.message}</p>`,
    }).catch(() => {});
    sendCreated(res, { id: inquiry.id }, 'Press inquiry received. We will respond within 48 hours.');
  } catch (error) {
    next(error);
  }
}
