import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2, 'Name is required').max(100).trim(),
  email: z.string().email('Invalid email').toLowerCase(),
  phone: z.string().optional(),
  subject: z.string().min(2, 'Subject is required').max(200).trim(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000).trim(),
});

export const newsletterSubscribeSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase(),
  firstName: z.string().max(50).optional(),
  source: z.string().optional(),
});

export const wholesaleInquirySchema = z.object({
  businessName: z.string().min(2, 'Business name required').max(200).trim(),
  contactName: z.string().min(2, 'Contact name required').max(100).trim(),
  email: z.string().email('Invalid email').toLowerCase(),
  phone: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  country: z.string().min(2, 'Country required'),
  city: z.string().optional(),
  interestedIn: z.string().min(5, 'Please describe your interest').max(500),
  orderVolume: z.string().optional(),
  message: z.string().max(1000).optional(),
});

export const pressInquirySchema = z.object({
  contactName: z.string().min(2, 'Contact name required').max(100).trim(),
  publication: z.string().min(2, 'Publication required').max(200).trim(),
  email: z.string().email('Invalid email').toLowerCase(),
  phone: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  inquiryType: z.string().min(2, 'Inquiry type required'),
  message: z.string().min(20, 'Message required').max(2000).trim(),
  deadline: z.string().datetime().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type NewsletterSubscribeInput = z.infer<typeof newsletterSubscribeSchema>;
export type WholesaleInquiryInput = z.infer<typeof wholesaleInquirySchema>;
export type PressInquiryInput = z.infer<typeof pressInquirySchema>;
