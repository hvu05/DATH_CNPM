import { NextFunction, Request, Response } from 'express';
import { ApiResponse } from '../../dtos/common/api-response';
import {
  getInventoryLogs,
  getInventorySummary,
  InventoryLogFilters,
} from '../../services/inventory-log.service';

// GET /admin/inventory-logs
export const getLogsHandler = async (
  req: Request,
  res: Response<ApiResponse<any>>,
  next: NextFunction,
) => {
  try {
    const {
      page = '1',
      limit = '10',
      type,
      productId,
      search,
      sortBy = 'id',
      sortOrder = 'desc',
    } = req.query;

    const filters: InventoryLogFilters = {
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
      type: type as 'IN' | 'OUT' | undefined,
      productId: productId ? parseInt(productId as string, 10) : undefined,
      search: search as string | undefined,
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc',
    };

    const result = await getInventoryLogs(filters);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

// GET /admin/inventory-logs/summary
export const getSummaryHandler = async (
  req: Request,
  res: Response<ApiResponse<any>>,
  next: NextFunction,
) => {
  try {
    const summary = await getInventorySummary();

    return res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error: any) {
    next(error);
  }
};
