// import { OrderItemResponse } from "./order-item.response";

// export interface OrderResponse {
//   id: string;
//   user_id: string;
//   total: number;
//   status: string;
  
//   province: string;
//   ward: string;
//   detail: string;

//   note?: string ;

//   create_at: Date;
//   deliver_at?: Date ;
//   order_items: OrderItemResponse[];
  
// }
import z from "zod";
import { registry } from "../../config/openapi.config";
import { OrderItemResponseSchema } from "./order-item.response";

export const OrderResponseSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  total: z.number(),
  status: z.string(),
  province: z.string(),
  ward: z.string(),
  detail: z.string(),
  note: z.string().optional(),
  create_at: z.date(),
  deliver_at: z.date().optional(),
  order_items: z.array(OrderItemResponseSchema),
});

export type OrderResponse = z.infer<typeof OrderResponseSchema>;