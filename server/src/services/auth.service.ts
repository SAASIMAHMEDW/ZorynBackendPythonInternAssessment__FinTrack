import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { AppError } from '../utils/response';
import { RegisterInput, LoginInput } from '../validators/auth';
import { JwtPayload } from '../types';

// Select fields to return (never expose password)
const safeUserSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  role: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class AuthService {
  /**
   * Register a new user.
   */
  static async register(data: RegisterInput) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new AppError('An account with this email already exists', 409);
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
      },
      select: safeUserSelect,
    });

    return user;
  }

  /**
   * Authenticate a user and return access + refresh tokens.
   */
  static async login(data: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    if (user.status === 'INACTIVE') {
      throw new AppError(
        'Your account has been deactivated. Please contact an administrator.',
        403
      );
    }

    const isValid = await bcrypt.compare(data.password, user.password);
    if (!isValid) {
      throw new AppError('Invalid email or password', 401);
    }

    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Persist refresh token
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.refreshToken.create({
      data: { token: refreshToken, userId: user.id, expiresAt },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status,
      },
    };
  }

  /**
   * Rotate refresh token and issue a new access token.
   */
  static async refresh(oldRefreshToken: string) {
    const stored = await prisma.refreshToken.findUnique({
      where: { token: oldRefreshToken },
      include: { user: true },
    });

    if (!stored) {
      throw new AppError('Invalid refresh token', 401);
    }

    if (stored.expiresAt < new Date()) {
      await prisma.refreshToken.delete({ where: { id: stored.id } });
      throw new AppError('Refresh token has expired. Please log in again.', 401);
    }

    if (stored.user.status === 'INACTIVE') {
      await prisma.refreshToken.delete({ where: { id: stored.id } });
      throw new AppError('Your account has been deactivated.', 403);
    }

    // Token rotation: delete all old tokens for user → create new
    await prisma.refreshToken.deleteMany({ where: { userId: stored.user.id } });

    const payload: JwtPayload = {
      userId: stored.user.id,
      email: stored.user.email,
      role: stored.user.role,
    };

    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.refreshToken.create({
      data: { token: newRefreshToken, userId: stored.user.id, expiresAt },
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: {
        id: stored.user.id,
        email: stored.user.email,
        firstName: stored.user.firstName,
        lastName: stored.user.lastName,
        role: stored.user.role,
        status: stored.user.status,
      },
    };
  }

  /**
   * Invalidate a refresh token (logout).
   */
  static async logout(refreshTokenValue: string) {
    await prisma.refreshToken.deleteMany({
      where: { token: refreshTokenValue },
    });
  }

  /**
   * Return the authenticated user's profile.
   */
  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: safeUserSelect,
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }
}
