import z from "zod";

export const CategoryCreateSchema = z.object({
  name: z.string().nonempty("Category name is required"),
  parent_id: z.number().int().positive().optional(), // optional vì có thể không có
});

export type CategoryCreateRequest = z.infer<typeof CategoryCreateSchema> 