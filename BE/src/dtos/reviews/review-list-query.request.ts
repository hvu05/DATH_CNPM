import z from "zod";

export const ReviewListQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    vote : z.number().int().min(1).max(5).optional(),
    sortBy: z.enum(['create_at']).default('create_at'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type ReviewListQuery = z.infer<typeof ReviewListQuerySchema>;
