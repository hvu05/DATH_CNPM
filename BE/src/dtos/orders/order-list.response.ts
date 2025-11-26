import { OrderResponseSchema } from "./order.response"
import { OrderListQuerySchema } from "./order-list-query.request"

// export interface OrderListResponse {
//   count: number
//   orders: OrderResponse[]
// }
import z from "zod";
import { UserResponseSchema } from "../users";

export const OrderListResponseSchema = z.object({
  count: z.number(),
  orders: z.array(OrderResponseSchema),
  filters: OrderListQuerySchema.optional()
})
export const OrdersUserListResponseSchema = z.object({
  count: z.number(),
  user: UserResponseSchema.pick({
    id: true,
    full_name: true,
    avatar: true,
  }),
  orders: z.array(OrderResponseSchema.omit({ user_id: true })),
})
export type OrdersUserListResponse = z.infer<typeof OrdersUserListResponseSchema>
export type OrderListResponse = z.infer<typeof OrderListResponseSchema>
