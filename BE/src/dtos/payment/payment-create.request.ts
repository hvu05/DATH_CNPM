import { PaymentMethod } from "./enum";
import z from "zod";
export const paymentCreateSchema = z.object({
    order_id: z.string(),
    amount: z.number(),
    payment_method: z.enum(PaymentMethod)
})

export type PaymentCreateRequest = z.infer<typeof paymentCreateSchema>
