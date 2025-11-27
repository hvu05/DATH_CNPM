import { z } from "zod";

export const CategoryResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  create_at: z.date(),
  parent_id: z.number().nullable(),
});

export const CategoryListSchema = z.object({
  count: z.number(),
  results: CategoryResponseSchema.array(),
});
export type CategoryList = z.infer<typeof CategoryListSchema>;
export type CategoryResponse = z.infer<typeof CategoryResponseSchema>;