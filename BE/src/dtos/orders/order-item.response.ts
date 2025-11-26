// export interface ProductVariant {
//   id: number ,
//   product_id : number
//   color?: string ;
//   storage?: string ;
//   name : string;
//   price: number;
// }

// export interface OrderItemResponse {
//   id: number;
//   price_per_item: number;
//   quantity: number;
//   product_variant: ProductVariant;
// }
import z from "zod";

export const OrderItemResponseSchema = z.object({
  id: z.number(),
  price_per_item: z.number(),
  quantity: z.number(),
  status: z.string().nullable().optional(),
  product_variant: z.object({
    id: z.number(),
    product_id: z.number(),
    thumbnail: z.string().optional(),
    color: z.string().optional(),
    storage: z.string().optional(),
    name: z.string(),
    price: z.number(),
  }),
});

export type OrderItemResponse = z.infer<typeof OrderItemResponseSchema>;
