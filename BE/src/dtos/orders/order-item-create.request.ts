import z from "zod";

export const OrderItemCreateSchema = z.object({
  product_id : z.string().nonempty("Product is required"),
  product_variant_id : z.string().nonempty("Product variant is required"),
  quantity : z.number().int().positive("Quantity must be greater than 0") 
})

export type OrderItemCreateRequest = z.infer<typeof OrderItemCreateSchema>