import { OrderResponseSchema } from "."

// export interface OrderListResponse {
//   count: number
//   orders: OrderResponse[]
// }
import z from "zod";

export const OrderListResponseSchema = z.object({
  count: z.number(),
  orders: z.array(OrderResponseSchema)
})

export type OrderListResponse = z.infer<typeof OrderListResponseSchema>
