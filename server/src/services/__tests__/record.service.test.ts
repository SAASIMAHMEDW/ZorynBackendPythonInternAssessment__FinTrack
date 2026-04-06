import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RecordService } from '../record.service';
import { prisma } from '../../lib/prisma';
import { Prisma } from '@prisma/client';

// Mock the prisma client
vi.mock('../../lib/prisma', () => ({
  prisma: {
    financialRecord: {
      findMany: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
    },
  },
}));

describe('RecordService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('findAll', () => {
    it('should query with search parameter for description and category', async () => {
      // Setup mock returns
      (prisma.financialRecord.findMany as any).mockResolvedValueOnce([]);
      (prisma.financialRecord.count as any).mockResolvedValueOnce(0);

      // Execute specific search
      await RecordService.findAll({
        page: 1,
        limit: 10,
        sort: 'createdAt',
        order: 'desc',
        search: 'grocery',
      });

      // Assert the prisma queries matched expectations
      expect(prisma.financialRecord.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: [
              { description: { contains: 'grocery', mode: 'insensitive' } },
              { category: { contains: 'grocery', mode: 'insensitive' } },
            ],
          }),
        })
      );
    });

    it('should query with category specifically', async () => {
      (prisma.financialRecord.findMany as any).mockResolvedValueOnce([]);
      (prisma.financialRecord.count as any).mockResolvedValueOnce(0);

      await RecordService.findAll({
        page: 1,
        limit: 10,
        sort: 'createdAt',
        order: 'desc',
        category: 'food',
      });

      expect(prisma.financialRecord.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            category: { equals: 'food', mode: 'insensitive' },
          }),
        })
      );
    });
  });
});
