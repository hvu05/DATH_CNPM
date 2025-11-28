import { z } from 'zod';

export const ProductListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.enum(['create_at', 'name', 'quantity']).default('create_at'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  categoryId: z.coerce.number().int().min(1).optional(),
  search: z.string().optional(),
  is_active: z
    .string()
    .transform((val) => val === 'true')
    .optional(),
});

export const CategoriesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// Schema for product variant
export const ProductVariantSchema = z.object({
  color: z.string().min(1, 'Color is required'),
  storage: z.string().min(1, 'Storage is required'),
  price: z.coerce.number().int().nonnegative('Price must be non-negative'),
  import_price: z.coerce
    .number()
    .int()
    .nonnegative('Import price must be non-negative'),
  quantity: z.coerce
    .number()
    .int()
    .nonnegative('Quantity must be non-negative'),
});

// Schema for product specification
export const ProductSpecSchema = z.object({
  name: z.string().min(1, 'Spec name is required'),
  value: z.string().min(1, 'Spec value is required'),
});

// Helper to parse JSON string to array
const jsonArraySchema = <T extends z.ZodTypeAny>(schema: T) =>
  z.union([
    z.array(schema),
    z
      .string()
      .transform((str, ctx) => {
        try {
          const parsed = JSON.parse(str);
          return parsed;
        } catch {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Invalid JSON string',
          });
          return z.NEVER;
        }
      })
      .pipe(z.array(schema)),
  ]);

export const NewProductsSchema = z.object({
  name: z.string().trim().min(3, 'Product name must be at least 3 characters'),
  description: z.string().min(1, 'Description is required'),
  brand_id: z.coerce.number().int().positive('Brand ID is required'),
  series_id: z.coerce.number().int().positive('Series ID is required'),
  category_id: z.coerce.number().int().positive('Category ID is required'),
  is_active: z.preprocess(
    (val) => val === 'true' || val === true,
    z.boolean().default(true),
  ),
  // Variants array - required, at least 1
  variants: jsonArraySchema(ProductVariantSchema).refine(
    (arr) => arr.length >= 1,
    { message: 'At least one variant is required' },
  ),
  // Specifications array - optional
  specifications: jsonArraySchema(ProductSpecSchema).optional().default([]),
});

export type ProductListQueryRequest = z.infer<typeof ProductListQuerySchema>;
export type CategoriesQueryRequest = z.infer<typeof CategoriesQuerySchema>;
export type ProductVariantInput = z.infer<typeof ProductVariantSchema>;
export type ProductSpecInput = z.infer<typeof ProductSpecSchema>;
export type NewProductBody = z.infer<typeof NewProductsSchema>;
