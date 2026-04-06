import { Response } from 'express';
import { RecordService } from '../services/record.service';
import { sendSuccess, sendPaginated } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthenticatedRequest } from '../types';

/**
 * POST /api/records
 */
export const createRecord = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const record = await RecordService.create(req.body, req.user!.userId);
    sendSuccess(res, record, 'Financial record created', 201);
  }
);

/**
 * GET /api/records
 */
export const getRecords = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { records, total } = await RecordService.findAll(req.query as any);
    const { page, limit } = req.query as any;
    sendPaginated(res, records, total, Number(page), Number(limit), 'Records retrieved');
  }
);

/**
 * GET /api/records/:id
 */
export const getRecordById = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const record = await RecordService.findById(req.params.id as string);
    sendSuccess(res, record, 'Record retrieved');
  }
);

/**
 * PATCH /api/records/:id
 */
export const updateRecord = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const record = await RecordService.update(req.params.id as string, req.body);
    sendSuccess(res, record, 'Record updated');
  }
);

/**
 * DELETE /api/records/:id
 */
export const deleteRecord = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const result = await RecordService.softDelete(req.params.id as string);
    sendSuccess(res, result, 'Record deleted');
  }
);
