import { z } from 'zod';
import {
  CategoryResponseSchema,
  CategoryResponse,
} from '../category/category.response';

/* =============================
   BRAND RESPONSE
============================= */
export const BrandResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  image_url: z.string().nullable(),
  category_id: z.number(),

  // Relation (optional)
  category: CategoryResponseSchema.optional(),
});

export type BrandResponse = z.infer<typeof BrandResponseSchema>;
