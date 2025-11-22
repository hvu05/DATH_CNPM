import z from "zod";
import { OrderItemCreateSchema } from "./order-item-create.request";
import { PaymentMethod } from "../payment";

export const OrderCreateSchema = z.object({
  province : z.string().nonempty("Province is required"),
  ward : z.string().nonempty("Ward is required"),
  detail : z.string().nonempty("Street is required"),
  items : z.array(OrderItemCreateSchema).min(1, "Order must have at least 1 item"),
  note : z.string().optional(),
  method: z.enum(PaymentMethod).default(PaymentMethod.COD),
});

export type OrderCreateRequest = z.infer<typeof OrderCreateSchema>;