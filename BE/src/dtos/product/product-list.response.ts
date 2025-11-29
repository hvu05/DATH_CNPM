import z from 'zod';
import { ProductResponseSchema } from './product.response';

export const ProductListResponseSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total_items: z.number(),
  total_pages: z.number(),
  results: z.array(
    ProductResponseSchema.omit({
      product_specs: true,
      product_variants: true,
    }),
  ),
});

export type ProductListResponse = z.infer<typeof ProductListResponseSchema>;
