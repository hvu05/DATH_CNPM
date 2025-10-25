import { PaymentCreateRequest } from '../dtos/payment/payment-create.request';
import { prisma } from '../config/prisma.config';
import { PaymentMethod, PaymentStatus } from '../dtos/payment';
import { AppError, ErrorCode } from '../exeptions';
import { getPaymentUrl } from './vnpay.service';
import { Payment } from '@prisma/client';
/**
 *
 * @param data
 * @param user_id
 * @returns payment : Payment, url? : string # url neu thanh toan bang VNPAY
 *
 */
export const createPayment = async (
  data: PaymentCreateRequest,
  user_id?: string,
): Promise<{ payment: Payment; url?: string }> => {
  const order = await prisma.order.findUnique({
    where: {
      id: data.order_id,
    },
  });
  if (!order) throw new AppError(ErrorCode.NOT_FOUND, 'Không tìm thấy Order');
  const payment = await prisma.payment.create({
    data: {
      order: {
        connect: {
          id: data.order_id,
        },
      },
      user: {
        connect: {
          id: user_id,
        },
      },
      amount: data.amount,
      method: data.payment_method,
      payment_status: PaymentStatus.PENDING,
    },
  });
  if (data.payment_method == PaymentMethod.VNPAY) {
    const url = await getPaymentUrl(order.total, order.id);
    return {
      payment: payment,
      url: url,
    };
  }

  return {
    payment: payment,
  };
};
