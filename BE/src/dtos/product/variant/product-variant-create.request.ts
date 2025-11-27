import z from "zod";

export const ProductVariantCreateSchema = z.object({
  color: z.string().nonempty("Color is required"),
  storage: z.string().nonempty("Storage is required"),
  price: z.coerce.number().int().nonnegative("Price must be non-negative"),
  quantity: z.coerce.number().int().nonnegative("Quantity must be non-negative"),
  import_price: z.coerce.number().int().nonnegative("Import price must be non-negative"),
  export_price: z.coerce.number().int().nonnegative("Export price must be non-negative"),
  is_active: z.coerce.boolean().optional().default(true),
});

export type ProductVariantCreate = z.infer<typeof ProductVariantCreateSchema>;