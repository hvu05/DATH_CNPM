import { OrderItemResponse } from "./order-item.response";

export interface OrderResponse {
  id: string;
  user_id: string;
  total: number;
  status: string;
  
  province: string;
  ward: string;
  detail: string;

  note?: string;

  create_at: Date;
  deliver_at?: Date;
  items: OrderItemResponse[];
}
