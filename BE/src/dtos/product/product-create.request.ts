import z from "zod";

export const ProductCreateSchema = z.object({
  name: z.string().nonempty("Product name is required"),
  description: z.string().nonempty("Product description is required"),
  quantity: z.number().int().nonnegative("Quantity must be non-negative"),
  brand_id: z.number().int().positive("Brand ID is required"),
  series_id: z.number().int().positive("Series ID is required"),
  category_id: z.number().int().positive("Category ID is required"),
  is_active: z.boolean().optional(),
});

export type ProductCreateRequest = z.infer<typeof ProductCreateSchema>;