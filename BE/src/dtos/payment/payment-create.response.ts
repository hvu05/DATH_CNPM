import z from "zod";
import { PaymentResponseSchema } from "./payment.response";

export const PaymentCreateResponseSchema = z.object({
  payment: PaymentResponseSchema,
  url: z.string().optional()
})

export type PaymentCreateResponse = z.infer<typeof PaymentCreateResponseSchema>