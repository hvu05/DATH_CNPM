import { z } from 'zod';

export const UserListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.enum(['create_at']).default('create_at'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  roles: z
    .string()
    .optional()
    .transform((val) =>
      val ? val.split(',').map((r) => r.trim().toUpperCase()) : undefined,
    ),
  isActive: z
    .string()
    .optional()
    .transform((val) =>
      val ? val.split(',').map((v) => v.trim() === 'true') : undefined,
    ),
  search: z.string().optional(),
});

export type UserListQueryRequest = z.infer<typeof UserListQuerySchema>;
