import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '../config/database';
import { redis } from '../config/redis';
import { generateTokenPair, verifyRefreshToken } from '../utils/jwt';
import {
  sendSuccess,
  sendCreated,
  sendError,
  sendUnauthorized,
} from '../utils/response';
import {
  sendWelcomeEmail,
  sendPasswordResetEmail,
} from '../utils/email';
import { AuthRequest } from '../middlewares/auth.middleware';
import { AppError, NotFoundError } from '../middlewares/error.middleware';
import type {
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  ChangePasswordInput,
} from '../schemas/auth.schema';

export async function register(
  req: Request<{}, {}, RegisterInput>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      sendError(res, 'An account with this email already exists', 409);
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { email, passwordHash, firstName, lastName, phone },
      select: { id: true, email: true, firstName: true, lastName: true, role: true },
    });

    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: await bcrypt.hash(tokens.refreshToken, 10) },
    });

    await sendWelcomeEmail(user.email, user.firstName).catch(() => {});

    sendCreated(res, { user, ...tokens }, 'Account created successfully');
  } catch (error) {
    next(error);
  }
}

export async function login(
  req: Request<{}, {}, LoginInput>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        deletedAt: true,
      },
    });

    if (!user || user.deletedAt || !await bcrypt.compare(password, user.passwordHash)) {
      sendUnauthorized(res, 'Invalid email or password');
      return;
    }

    if (!user.isActive) {
      sendError(res, 'Account has been deactivated. Please contact support.', 403);
      return;
    }

    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken: await bcrypt.hash(tokens.refreshToken, 10),
        lastLoginAt: new Date(),
      },
    });

    const { passwordHash: _, ...safeUser } = user;
    sendSuccess(res, { user: safeUser, ...tokens }, 'Login successful');
  } catch (error) {
    next(error);
  }
}

export async function logout(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (req.user) {
      await prisma.user.update({
        where: { id: req.user.id },
        data: { refreshToken: null },
      });
    }
    sendSuccess(res, null, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
}

export async function refreshToken(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { refreshToken: token } = req.body;
    if (!token) {
      sendUnauthorized(res, 'Refresh token required');
      return;
    }

    const payload = verifyRefreshToken(token);

    const user = await prisma.user.findFirst({
      where: { id: payload.userId, isActive: true, deletedAt: null },
      select: { id: true, email: true, role: true, refreshToken: true },
    });

    if (!user || !user.refreshToken || !await bcrypt.compare(token, user.refreshToken)) {
      sendUnauthorized(res, 'Invalid refresh token');
      return;
    }

    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: await bcrypt.hash(tokens.refreshToken, 10) },
    });

    sendSuccess(res, tokens, 'Token refreshed');
  } catch (error) {
    next(error);
  }
}

export async function forgotPassword(
  req: Request<{}, {}, ForgotPasswordInput>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    // Always return success to prevent email enumeration
    if (user) {
      const token = crypto.randomBytes(32).toString('hex');
      const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await prisma.user.update({
        where: { id: user.id },
        data: { resetToken: await bcrypt.hash(token, 10), resetTokenExpiry: expiry },
      });

      const resetUrl = `${process.env.APP_URL}/reset-password?token=${token}&email=${email}`;
      await sendPasswordResetEmail(email, resetUrl).catch(() => {});
    }

    sendSuccess(
      res,
      null,
      'If an account with that email exists, a reset link has been sent.',
    );
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(
  req: Request<{}, {}, ResetPasswordInput>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { token, password } = req.body;
    const email = req.query.email as string;

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, resetToken: true, resetTokenExpiry: true },
    });

    if (
      !user ||
      !user.resetToken ||
      !user.resetTokenExpiry ||
      user.resetTokenExpiry < new Date() ||
      !await bcrypt.compare(token, user.resetToken)
    ) {
      sendError(res, 'Invalid or expired reset token', 400);
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenExpiry: null,
        refreshToken: null,
      },
    });

    sendSuccess(res, null, 'Password reset successfully. Please log in.');
  } catch (error) {
    next(error);
  }
}

export async function getMe(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatarUrl: true,
        role: true,
        isEmailVerified: true,
        createdAt: true,
      },
    });
    sendSuccess(res, user);
  } catch (error) {
    next(error);
  }
}

export async function changePassword(
  req: AuthRequest & { body: ChangePasswordInput },
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { passwordHash: true },
    });

    if (!user || !await bcrypt.compare(currentPassword, user.passwordHash)) {
      sendError(res, 'Current password is incorrect', 400);
      return;
    }

    await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        passwordHash: await bcrypt.hash(newPassword, 12),
        refreshToken: null,
      },
    });

    sendSuccess(res, null, 'Password changed successfully');
  } catch (error) {
    next(error);
  }
}
