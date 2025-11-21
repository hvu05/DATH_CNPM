import { OrderResponseSchema } from "./order.response"
import { OrderListQuerySchema } from "./order-list-query.request"

// export interface OrderListResponse {
//   count: number
//   orders: OrderResponse[]
// }
import z from "zod";

export const OrderListResponseSchema = z.object({
  count: z.number(),
  orders: z.array(OrderResponseSchema),
  filters: OrderListQuerySchema.optional()
})

export type OrderListResponse = z.infer<typeof OrderListResponseSchema>
