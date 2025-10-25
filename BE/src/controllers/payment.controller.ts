import { Payment } from '@prisma/client';
import { PaymentCreateRequest } from '../dtos/payment/payment-create.request'
import * as paymentService from '../services/payment.service'
import e, { Request, Response, NextFunction } from 'express'
import { ApiResponse } from '../types/api-response';

export const createPaymentHandler = async (req: Request, res: Response<ApiResponse<{ payment: Payment, url?: string }>>, next: NextFunction) => {
    const data : PaymentCreateRequest = req.body;
    const user_id = req.user?.id
    try {
        const response = await paymentService.createPayment(data, user_id);
        res.status(200).json({
            success: true,
            data: response
        });
    }
    catch (err : Error | any ){
        next(err);
    }
}