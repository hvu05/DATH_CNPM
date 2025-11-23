import { z } from "zod";

export const ProductListQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    sortBy: z.enum(['create_at', 'name']).default('create_at'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
    categoryId: z.coerce.number().int().min(1).optional(),
    search: z.string().optional()
});

export const CategoriesQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20)
})

export const NewProductsSchema = z.object({
    name: z.string().trim().min(3),
    description: z.string(),
    quantity: z.coerce.number().int().min(1),
    brand_id: z.coerce.number().int(),
    series_id: z.coerce.number().int(),
    category_id: z.coerce.number().int(),
    is_active: z.boolean().default(true),
})

export type ProductListQueryRequest = z.infer<typeof ProductListQuerySchema>;
export type CategoriesQueryRequest = z.infer<typeof CategoriesQuerySchema>;
export type NewProductBody = z.infer<typeof NewProductsSchema>;