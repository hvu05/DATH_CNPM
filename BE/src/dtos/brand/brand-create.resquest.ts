import { z } from 'zod';

/* =============================
   CREATE / UPDATE BRAND REQUEST
============================= */
export const BrandCreateSchema = z.object({
  name: z.string().nonempty('Brand name is required'),
  description: z.string().nonempty('Brand description is required'),
  image_url: z.string().url().optional(),
  category_id: z.number().int().positive('Category ID is required'),
});

export type BrandCreateRequest = z.infer<typeof BrandCreateSchema>;

/* =============================
   UPDATE BRAND REQUEST
============================= */
export const BrandUpdateSchema = z.object({
  name: z.string().nonempty('Brand name is required').optional(),
  description: z.string().nonempty('Brand description is required').optional(),
  image_url: z.string().url().optional(),
  category_id: z.number().int().positive().optional(),
});

export type BrandUpdateRequest = z.infer<typeof BrandUpdateSchema>;
