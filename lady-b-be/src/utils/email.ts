import nodemailer from 'nodemailer';
import { env } from '../config/env';
import { logger } from './logger';

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_SECURE,
  auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
});

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  attachments?: nodemailer.SendMailOptions['attachments'];
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  try {
    await transporter.sendMail({
      from: env.EMAIL_FROM,
      ...options,
    });
    logger.info(`Email sent to ${options.to}`);
  } catch (error) {
    logger.error('Email send failed', { error, to: options.to, subject: options.subject });
    throw error;
  }
}

export async function sendOrderConfirmation(
  email: string,
  name: string,
  orderNumber: string,
  total: string,
): Promise<void> {
  await sendEmail({
    to: email,
    subject: `Order Confirmed — ${orderNumber} | Lady B Designs`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #fafaf8;">
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="font-size: 28px; color: #1a1a1a; letter-spacing: 2px; font-weight: 400;">LADY B DESIGNS</h1>
          <p style="color: #8b7355; font-size: 12px; letter-spacing: 3px; text-transform: uppercase;">Handcrafted Luxury</p>
        </div>
        <h2 style="color: #1a1a1a; font-weight: 400; font-size: 22px;">Thank you, ${name}.</h2>
        <p style="color: #555; line-height: 1.8;">Your order has been confirmed and our artisans have been notified. Each piece is crafted with care, and we will keep you informed at every step.</p>
        <div style="background: #fff; border: 1px solid #e8e0d4; padding: 24px; margin: 32px 0; border-radius: 2px;">
          <p style="margin: 0; color: #8b7355; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">Order Number</p>
          <p style="margin: 8px 0 0; font-size: 18px; color: #1a1a1a; font-weight: 500;">${orderNumber}</p>
          <p style="margin: 16px 0 0; color: #8b7355; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">Total</p>
          <p style="margin: 8px 0 0; font-size: 18px; color: #1a1a1a; font-weight: 500;">${total}</p>
        </div>
        <p style="color: #555; line-height: 1.8;">You will receive a shipping notification once your order is dispatched.</p>
        <div style="margin-top: 48px; padding-top: 32px; border-top: 1px solid #e8e0d4; text-align: center;">
          <p style="color: #8b7355; font-size: 12px;">Lady B Designs and Handcraft</p>
          <p style="color: #aaa; font-size: 11px;">731 Westbury West Dr, Indianapolis, IN 46224</p>
        </div>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, resetUrl: string): Promise<void> {
  await sendEmail({
    to: email,
    subject: 'Reset Your Password — Lady B Designs',
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #fafaf8;">
        <h1 style="font-size: 28px; color: #1a1a1a; text-align: center; letter-spacing: 2px; font-weight: 400;">LADY B DESIGNS</h1>
        <h2 style="color: #1a1a1a; font-weight: 400; font-size: 22px; margin-top: 40px;">Password Reset Request</h2>
        <p style="color: #555; line-height: 1.8;">We received a request to reset the password for your Lady B Designs account. Click the button below to proceed:</p>
        <div style="text-align: center; margin: 40px 0;">
          <a href="${resetUrl}" style="background: #1a1a1a; color: #fff; padding: 16px 40px; text-decoration: none; font-size: 13px; letter-spacing: 2px; text-transform: uppercase;">Reset Password</a>
        </div>
        <p style="color: #888; font-size: 13px;">This link expires in 1 hour. If you did not request a reset, please ignore this email.</p>
      </div>
    `,
  });
}

export async function sendWelcomeEmail(email: string, firstName: string): Promise<void> {
  await sendEmail({
    to: email,
    subject: 'Welcome to Lady B Designs',
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #fafaf8;">
        <h1 style="font-size: 28px; color: #1a1a1a; text-align: center; letter-spacing: 2px; font-weight: 400;">LADY B DESIGNS</h1>
        <p style="color: #8b7355; font-size: 12px; letter-spacing: 3px; text-transform: uppercase; text-align: center;">Handcrafted Luxury</p>
        <h2 style="color: #1a1a1a; font-weight: 400; font-size: 22px; margin-top: 40px;">Welcome, ${firstName}.</h2>
        <p style="color: #555; line-height: 1.8;">You have joined a community of women who appreciate rare, expressive, handcrafted fashion. Every piece in our collection is made by hand — designed to be worn, remembered, and treasured.</p>
        <p style="color: #555; line-height: 1.8;">We look forward to creating something beautiful for you.</p>
        <div style="text-align: center; margin: 40px 0;">
          <a href="${env.APP_URL}/shop" style="background: #1a1a1a; color: #fff; padding: 16px 40px; text-decoration: none; font-size: 13px; letter-spacing: 2px; text-transform: uppercase;">Explore the Collection</a>
        </div>
      </div>
    `,
  });
}

export async function sendCustomOrderConfirmation(
  email: string,
  name: string,
  referenceNumber: string,
): Promise<void> {
  await sendEmail({
    to: email,
    subject: `Custom Order Request Received — ${referenceNumber} | Lady B Designs`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #fafaf8;">
        <h1 style="font-size: 28px; color: #1a1a1a; text-align: center; letter-spacing: 2px; font-weight: 400;">LADY B DESIGNS</h1>
        <h2 style="color: #1a1a1a; font-weight: 400; font-size: 22px; margin-top: 40px;">Your bespoke request has been received.</h2>
        <p style="color: #555; line-height: 1.8;">Dear ${name},</p>
        <p style="color: #555; line-height: 1.8;">Thank you for your custom design inquiry. Our team will carefully review your request and respond within 2–3 business days with a personalised quote.</p>
        <div style="background: #fff; border: 1px solid #e8e0d4; padding: 24px; margin: 32px 0; border-radius: 2px;">
          <p style="margin: 0; color: #8b7355; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">Reference Number</p>
          <p style="margin: 8px 0 0; font-size: 18px; color: #1a1a1a; font-weight: 500;">${referenceNumber}</p>
        </div>
        <p style="color: #555; line-height: 1.8;">Please keep this reference number for your records. We will be in touch shortly.</p>
      </div>
    `,
  });
}

export async function sendNewsletterWelcome(email: string): Promise<void> {
  await sendEmail({
    to: email,
    subject: 'You\'re in — Lady B Designs VIP List',
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #fafaf8;">
        <h1 style="font-size: 28px; color: #1a1a1a; text-align: center; letter-spacing: 2px; font-weight: 400;">LADY B DESIGNS</h1>
        <p style="color: #8b7355; font-size: 12px; letter-spacing: 3px; text-transform: uppercase; text-align: center;">Private Access</p>
        <h2 style="color: #1a1a1a; font-weight: 400; font-size: 22px; margin-top: 40px;">Welcome to the inner circle.</h2>
        <p style="color: #555; line-height: 1.8;">You will be the first to know about new collections, limited editions, bespoke availability, and exclusive events. This is a space reserved for women who understand that true luxury is made by hand.</p>
      </div>
    `,
  });
}
