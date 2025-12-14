import { prisma } from '../config/prisma.config';

export interface InventoryLogFilters {
  page?: number;
  limit?: number;
  type?: 'IN' | 'OUT' | 'RETURNED';
  productId?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const getInventoryLogs = async (filters: InventoryLogFilters = {}) => {
  const {
    page = 1,
    limit = 10,
    type,
    productId,
    search,
    sortBy = 'id',
    sortOrder = 'desc',
  } = filters;

  const skip = (page - 1) * limit;

  // Build where clause
  const where: any = {};

  if (type) {
    where.type = type;
  }

  if (productId) {
    where.product_id = productId;
  }

  if (search) {
    where.OR = [
      { reason: { contains: search } },
      {
        product_variant: {
          product: {
            name: { contains: search },
          },
        },
      },
    ];
  }

  // Build orderBy
  const orderBy: any = {};
  if (sortBy === 'id') {
    orderBy.id = sortOrder;
  } else if (sortBy === 'quantity') {
    orderBy.quantity = sortOrder;
  } else if (sortBy === 'type') {
    orderBy.type = sortOrder;
  } else {
    orderBy.id = sortOrder;
  }

  const [logs, total] = await Promise.all([
    prisma.inventoryLog.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        product_variant: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                category: {
                  select: { name: true },
                },
                brand: {
                  select: { name: true },
                },
              },
            },
          },
        },
      },
    }),
    prisma.inventoryLog.count({ where }),
  ]);

  // Transform data
  const results = logs.map((log) => ({
    id: log.id,
    type: log.type as 'IN' | 'OUT',
    quantity: log.quantity,
    reason: log.reason,
    product_id: log.product_id,
    product_variant_id: log.product_variant_id,
    product_name: log.product_variant?.product?.name || 'Unknown',
    variant_info:
      `${log.product_variant?.color || ''} - ${log.product_variant?.storage || ''}`.trim() ||
      'N/A',
    category: log.product_variant?.product?.category?.name || 'N/A',
    brand: log.product_variant?.product?.brand?.name || 'N/A',
    price: log.product_variant?.price || 0,
  }));

  return {
    results,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get summary stats
export const getInventorySummary = async () => {
  const [totalIn, totalOut, totalReturned, recentLogs] = await Promise.all([
    prisma.inventoryLog.aggregate({
      where: { type: 'IN' },
      _sum: { quantity: true },
    }),
    prisma.inventoryLog.aggregate({
      where: { type: 'OUT' },
      _sum: { quantity: true },
    }),
    prisma.inventoryLog.aggregate({
      where: { type: 'RETURNED' },
      _sum: { quantity: true },
    }),
    prisma.inventoryLog.count(),
  ]);

  return {
    totalIn: totalIn._sum.quantity || 0,
    totalOut: totalOut._sum.quantity || 0,
    totalReturned: totalReturned._sum.quantity || 0,
    totalLogs: recentLogs,
  };
};
