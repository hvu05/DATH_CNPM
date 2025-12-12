import { z } from 'zod';
import {
  CategoryResponseSchema,
  CategoryResponse, 
} from '../category/category.response';

/* =============================
   SERIES RESPONSE SCHEMA
============================= */
export const SeriesResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  // description: z.string().optional(), // Bỏ comment nếu bảng Series có description
  // brand_id: z.number().optional(),    // Bỏ comment nếu cần trả về brand_id
});

/* =============================
   BRAND RESPONSE
============================= */
export const BrandResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  image_url: z.string().nullable(),
  category_id: z.number(),

  category: CategoryResponseSchema.optional(),

  series: z.array(SeriesResponseSchema).optional(), 
});

export type BrandResponse = z.infer<typeof BrandResponseSchema>;