import { Router } from 'express';
import {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  getMe,
  changePassword,
  verifyEmail,
  resendVerification,
} from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { authRateLimit } from '../middlewares/rate-limit.middleware';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  resendVerificationSchema,
} from '../schemas/auth.schema';

const router = Router();

router.post('/register', authRateLimit, validate(registerSchema), register);
router.post('/login', authRateLimit, validate(loginSchema), login);
router.post('/logout', authenticate, logout);
router.post('/refresh-token', validate(refreshTokenSchema), refreshToken);
router.post('/forgot-password', authRateLimit, validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);
router.get('/me', authenticate, getMe);
router.patch('/change-password', authenticate, validate(changePasswordSchema), changePassword);
router.get('/verify-email', verifyEmail);
router.post('/resend-verification', authRateLimit, validate(resendVerificationSchema), resendVerification);

export default router;
