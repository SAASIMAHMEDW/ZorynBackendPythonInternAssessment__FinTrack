import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';
import { config } from '../config';
import { AuthenticatedRequest } from '../types';

/**
 * POST /api/auth/register
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const user = await AuthService.register(req.body);
  sendSuccess(res, user, 'Registration successful', 201);
});

/**
 * POST /api/auth/login
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await AuthService.login(req.body);

  // Set refresh token as httpOnly cookie
  res.cookie(config.cookie.refreshTokenName, result.refreshToken, {
    httpOnly: config.cookie.httpOnly,
    secure: config.cookie.secure,
    sameSite: config.cookie.sameSite,
    maxAge: config.cookie.maxAge,
    path: config.cookie.path,
  });

  // Return access token in body (client stores in memory)
  sendSuccess(
    res,
    {
      accessToken: result.accessToken,
      user: result.user,
    },
    'Login successful'
  );
});

/**
 * POST /api/auth/refresh
 */
export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies[config.cookie.refreshTokenName];

  if (!refreshToken) {
    sendError(res, 'Refresh token not found', 401);
    return;
  }

  const result = await AuthService.refresh(refreshToken);

  // Rotate the cookie
  res.cookie(config.cookie.refreshTokenName, result.refreshToken, {
    httpOnly: config.cookie.httpOnly,
    secure: config.cookie.secure,
    sameSite: config.cookie.sameSite,
    maxAge: config.cookie.maxAge,
    path: config.cookie.path,
  });

  sendSuccess(
    res,
    {
      accessToken: result.accessToken,
      user: result.user,
    },
    'Token refreshed'
  );
});

/**
 * POST /api/auth/logout
 */
export const logout = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies[config.cookie.refreshTokenName];

  if (refreshToken) {
    await AuthService.logout(refreshToken);
  }

  // Clear the cookie
  res.clearCookie(config.cookie.refreshTokenName, {
    httpOnly: config.cookie.httpOnly,
    secure: config.cookie.secure,
    sameSite: config.cookie.sameSite,
    path: config.cookie.path,
  });

  sendSuccess(res, null, 'Logged out successfully');
});

/**
 * GET /api/auth/me
 */
export const getProfile = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = await AuthService.getProfile(req.user!.userId);
    sendSuccess(res, user, 'Profile retrieved');
  }
);
