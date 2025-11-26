import { Payment } from "@prisma/client";
import { PaymentResponse } from "./payment.response";
import { PaymentMethod, PaymentStatus } from "./enum";

export const toPaymentResponse = (payment: Payment) : PaymentResponse => {
  return {
    ...payment,
    amount: Number(payment.amount),
    payment_status: payment.payment_status as PaymentStatus,
    method: payment.method as PaymentMethod
  };
};