import { Payment } from '@prisma/client';
import * as paymentDto from '../dtos/payment';
import * as paymentService from '../services/payment.service';
import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types/api-response';

export const createPaymentHandler = async (
  req: Request,
  res: Response<ApiResponse<{ payment: paymentDto.PaymentResponse; url?: string }>>,
  next: NextFunction,
) => {
  const parsed = paymentDto.paymentCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: parsed.error.issues[0].message,
    });
  }
  const data: paymentDto.PaymentCreateRequest = parsed.data;
  const user_id = req.user?.id;
  try {
    const response = await paymentService.createPayment(data, user_id);
    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (err: Error | any) {
    next(err);
  }
};

export const verifyPaymentHandler = async (
  req: Request,
  res: Response<ApiResponse<paymentDto.PaymentResponse>>,
  next: NextFunction,
) => {
  const parsed = paymentDto.VnpayQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: parsed.error.issues[0].message,
    });
  }
  const data: paymentDto.VnpayQuery = parsed.data;
  try {
    const response = await paymentService.verifyAndUpdatePayment(data);
    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (err: Error | any) {
    next(err);
  }
};
