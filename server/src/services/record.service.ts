import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { AppError } from '../utils/response';
import {
  CreateRecordInput,
  UpdateRecordInput,
  QueryRecordInput,
} from '../validators/record';

export class RecordService {
  /**
   * Create a new financial record.
   */
  static async create(data: CreateRecordInput, userId: string) {
    const record = await prisma.financialRecord.create({
      data: {
        amount: new Prisma.Decimal(data.amount),
        type: data.type,
        category: data.category,
        date: new Date(data.date),
        description: data.description || '',
        createdBy: userId,
      },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    return record;
  }

  /**
   * Get a single record by ID (must not be soft-deleted).
   */
  static async findById(id: string) {
    const record = await prisma.financialRecord.findFirst({
      where: { id, isDeleted: false },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    if (!record) {
      throw new AppError('Financial record not found', 404);
    }

    return record;
  }

  /**
   * List records with filtering, search, sorting, and pagination.
   */
  static async findAll(query: QueryRecordInput) {
    const { page, limit, type, category, startDate, endDate, sort, order, search, range } =
      query;

    let effectiveStartDate = startDate;
    let effectiveEndDate = endDate;

    if (range) {
      const now = new Date();
      effectiveEndDate = now.toISOString().split('T')[0];
      
      switch (range) {
        case '7d':
          effectiveStartDate = new Date(now.setDate(now.getDate() - 7)).toISOString().split('T')[0];
          break;
        case '30d':
          effectiveStartDate = new Date(now.setDate(now.getDate() - 30)).toISOString().split('T')[0];
          break;
        case '90d':
          effectiveStartDate = new Date(now.setDate(now.getDate() - 90)).toISOString().split('T')[0];
          break;
        case 'ytd':
          effectiveStartDate = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
          break;
      }
    }

    const where: Prisma.FinancialRecordWhereInput = {
      isDeleted: false,
      ...(type && { type }),
      ...(category && { category: { equals: category, mode: 'insensitive' } }),
      ...(effectiveStartDate || effectiveEndDate
        ? {
            date: {
              ...(effectiveStartDate && { gte: new Date(effectiveStartDate) }),
              ...(effectiveEndDate && { lte: new Date(effectiveEndDate + 'T23:59:59') }),
            },
          }
        : {}),
      ...(search && {
        OR: [
          { description: { contains: search, mode: 'insensitive' } },
          { category: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const sortField =
      sort === 'date' ? 'date' : sort === 'amount' ? 'amount' : 'createdAt';

    const [records, total] = await Promise.all([
      prisma.financialRecord.findMany({
        where,
        orderBy: { [sortField]: order },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
        },
      }),
      prisma.financialRecord.count({ where }),
    ]);

    return { records, total };
  }

  /**
   * Update a financial record.
   */
  static async update(id: string, data: UpdateRecordInput) {
    const existing = await prisma.financialRecord.findFirst({
      where: { id, isDeleted: false },
    });

    if (!existing) {
      throw new AppError('Financial record not found', 404);
    }

    const record = await prisma.financialRecord.update({
      where: { id },
      data: {
        ...(data.amount !== undefined && {
          amount: new Prisma.Decimal(data.amount),
        }),
        ...(data.type && { type: data.type }),
        ...(data.category && { category: data.category }),
        ...(data.date && { date: new Date(data.date) }),
        ...(data.description !== undefined && { description: data.description }),
      },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    return record;
  }

  /**
   * Soft-delete a financial record.
   */
  static async softDelete(id: string) {
    const existing = await prisma.financialRecord.findFirst({
      where: { id, isDeleted: false },
    });

    if (!existing) {
      throw new AppError('Financial record not found', 404);
    }

    await prisma.financialRecord.update({
      where: { id },
      data: { isDeleted: true },
    });

    return { id };
  }
}
