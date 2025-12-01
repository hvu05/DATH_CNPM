import z from 'zod';
import { OrderStatus } from './enum';

export const OrderListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.enum(['create_at']).default('create_at'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  status: z.enum(OrderStatus).optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  min_price: z.coerce.number().optional(),
  max_price: z.coerce.number().optional(),
  search: z.string().optional(),
});
export type OrderListQuery = z.infer<typeof OrderListQuerySchema>;
