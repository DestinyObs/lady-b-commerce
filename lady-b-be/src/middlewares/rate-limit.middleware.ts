import rateLimit from 'express-rate-limit';
import { env } from '../config/env';
import { sendError } from '../utils/response';

export const globalRateLimit = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    sendError(res, 'Too many requests. Please try again later.', 429);
  },
});

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.AUTH_RATE_LIMIT_MAX,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    sendError(
      res,
      'Too many authentication attempts. Please try again in 15 minutes.',
      429,
    );
  },
});

export const uploadRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  handler: (_req, res) => {
    sendError(res, 'Upload rate limit exceeded.', 429);
  },
});

export const contactRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  handler: (_req, res) => {
    sendError(res, 'Message limit reached. Please try again later.', 429);
  },
});
