import z from "zod";
import { OrderResponseSchema } from "./order.response";
import { de, id } from "zod/v4/locales";

export const OrderReturnResponseSchema = z.object({
  order: z.object({
    id: z.string(),
    user_id: z.string(),
    total: z.number(),
    status: z.string(),
    address: z.object({
      id: z.number(),
      province: z.string(),
      ward: z.string(),
      detail: z.string(),
    }),
    deliver_at: z.date().optional(),
  }),
  order_item: z.object({
    id: z.number(),
    price_per_item: z.number(),
    quantity: z.number(),
    product_variant: z.object({
      id: z.number(),
      product_id: z.number(),
      thumbnail: z.string().optional(),
      color: z.string().optional(),
      storage: z.string().optional(),
      name: z.string(),
      price: z.number(),
    }),
  }),
  reason: z.string(),
  images: z.array(z.string()),
  create_at: z.date(),
  update_at: z.date(),
})

export type OrderReturnResponse = z.infer<typeof OrderReturnResponseSchema>