import z from "zod";

export const ProductFilterSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).default(10),
  search: z.string().optional(),
  category_id: z.coerce.number().optional(),
  brand_id: z.coerce.number().optional(),
  series_id: z.coerce.number().optional(),
  is_active: z.coerce.boolean().optional().default(true),
  sort_by: z.enum(['create_at', 'default_price']).default('create_at'),
  order: z.enum(['asc', 'desc']).default('desc'),
  min_price: z.coerce.number().optional(),
  max_price: z.coerce.number().optional(),
});

export type ProductFilterRequest = z.infer<typeof ProductFilterSchema>;
