import { PaymentCreateRequest } from '../dtos/payment/payment-create.request';
import { prisma } from '../config/prisma.config';
import * as paymentDto from '../dtos/payment';
import { AppError, ErrorCode } from '../exeptions';
import { getPaymentUrl, verifyHash } from './vnpay.service';
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
): Promise<{ payment: paymentDto.PaymentResponse; url?: string }> => {
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
      amount: order.total,
      method: data.payment_method,
      payment_status: paymentDto.PaymentStatus.PENDING,
    },
  });
  if (data.payment_method == paymentDto.PaymentMethod.VNPAY) {
    const url = await getPaymentUrl(order.total, order.id, payment.id);
    return {
      payment: paymentDto.toPaymentResponse(payment),
      url: url,
    };
  }

  return {
    payment: paymentDto.toPaymentResponse(payment),
  };
};

export const verifyAndUpdatePayment = async (data: paymentDto.VnpayQuery) => {
  try {
    const payment = await prisma.payment.findUnique({
      where: {
        id: data.vnp_TxnRef,
      }
    })
    if (!payment) throw new AppError(ErrorCode.NOT_FOUND, 'Không tìm thấy Payment');
    const verify = verifyHash(data);
    if (verify.vnp_TransactionStatus != '00'){
      await prisma.payment.update({
        where: {
          id: data.vnp_TxnRef,
        },
        data: {
          transaction_code: verify.vnp_TransactionNo?.toString(),
          payment_status: paymentDto.PaymentStatus.FAILED,
        }
      })
      throw new AppError(ErrorCode.BAD_REQUEST, 'Payment khong thanh cong');
    }
    await prisma.payment.update({
      where: {
        id: data.vnp_TxnRef,
      },
      data: {
        transaction_code: verify.vnp_TransactionNo?.toString(),
        payment_status: paymentDto.PaymentStatus.SUCCESS,
      }
    })
    return paymentDto.toPaymentResponse(payment);
  }
  catch (error) {
    throw error;
  }
};
