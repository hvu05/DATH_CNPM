import z from "zod";

export const ProductUpdateSchema = z.object({
  name: z.string().nonempty().optional(),
  description: z.string().nonempty().optional(),
  quantity: z.number().int().nonnegative().optional(),
  brand_id: z.number().int().positive().optional(),
  series_id: z.number().int().positive().optional(),
  category_id: z.number().int().positive().optional(),
  is_active: z.boolean().optional(),
});

export type ProductUpdateRequest = z.infer<typeof ProductUpdateSchema>;