import z from "zod";
import { PaymentMethod, PaymentStatus } from "./enum";
//  id: string;
//     order_id: string;
//     amount: bigint;
//     create_at: Date;
//     update_at: Date;
//     user_id: string;
//     method: string;
//     payment_status: string;
//     transaction_code: string | null;
export const PaymentResponseSchema = z.object({
  id: z.string(),
  order_id: z.string(),
  amount: z.number().min(1),
  create_at: z.date(),
  update_at: z.date(),
  user_id: z.string(),
  method: z.enum(PaymentMethod),
  payment_status: z.enum(PaymentStatus),
  transaction_code: z.string().nullable(),
})

export type PaymentResponse = z.infer<typeof PaymentResponseSchema>