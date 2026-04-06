import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { AppError } from '../utils/response';
import { UpdateUserInput, QueryUserInput } from '../validators/user';

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

export class UserService {
  /**
   * List users with optional filtering and pagination. Admin-only.
   */
  static async findAll(query: QueryUserInput) {
    const { page, limit, role, status, search } = query;

    const where: Prisma.UserWhereInput = {
      ...(role && { role }),
      ...(status && { status }),
      ...(search && {
        OR: [
          { email: { contains: search, mode: 'insensitive' } },
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: safeUserSelect,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return { users, total };
  }

  /**
   * Get a single user by ID.
   */
  static async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        ...safeUserSelect,
        _count: { select: { records: { where: { isDeleted: false } } } },
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  /**
   * Update user role / status / name.  Admin-only.
   */
  static async update(id: string, data: UpdateUserInput) {
    const existing = await prisma.user.findUnique({ where: { id } });

    if (!existing) {
      throw new AppError('User not found', 404);
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: safeUserSelect,
    });

    return user;
  }

  /**
   * Deactivate (soft-delete) a user.
   */
  static async deactivate(id: string) {
    const existing = await prisma.user.findUnique({ where: { id } });

    if (!existing) {
      throw new AppError('User not found', 404);
    }

    if (existing.status === 'INACTIVE') {
      throw new AppError('User is already deactivated', 400);
    }

    // Remove all refresh tokens so user is immediately logged out
    await prisma.refreshToken.deleteMany({ where: { userId: id } });

    const user = await prisma.user.update({
      where: { id },
      data: { status: 'INACTIVE' },
      select: safeUserSelect,
    });

    return user;
  }
}
