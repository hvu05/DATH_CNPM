import z from 'zod';

export const ReviewCreateSchema = z.object({
  comment: z.string().nonempty('Content is required'),
  // product_id: z.number(),
  vote: z.number().min(1).max(5),
  parent_id: z.number().optional(),
});

export type ReviewCreateRequest = z.infer<typeof ReviewCreateSchema>;
