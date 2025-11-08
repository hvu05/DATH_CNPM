import z from "zod";

export const ProductFilterSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  category_id: z.string().optional(),
  brand_id: z.string().optional(),
  series_id: z.string().optional(),
  is_active: z.string().optional(),
  sort_by: z.string().optional(),
  order: z.string().optional(),
});

export type ProductFilterRequest = z.infer<typeof ProductFilterSchema>;
