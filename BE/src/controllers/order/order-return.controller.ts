import { Request, Response, NextFunction } from "express";

import * as orderReturnSerivce from "../../services/order/order-return.service";
import { AppError, ErrorCode } from "../../exeptions";
import * as orderDto from "../../dtos/orders";
import { ApiResponse } from "../../dtos/common/api-response";

export const staffReturnOrderHandler = async (
  req: Request,
  res: Response<ApiResponse<orderDto.OrderResponse>>,
  next: NextFunction,
) => {
  try {
    const orderId = req.params.order_id;
    const orderItemId = Number(req.params.order_item_id);
    const user = req.user;
    if (!user) {
      throw new AppError(
        ErrorCode.UNAUTHORIZED,
        'Lỗi!!!! Chưa xác thực người dùng',
      );
    }
    const order = await orderReturnSerivce.confirmReturned(orderId, orderItemId, user);
    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const createReturnOrderRequestHandler = async (
  req: Request,
  res: Response<ApiResponse<orderDto.OrderReturnResponse>>,
  next: NextFunction,
) => {
  const parsed = orderDto.OrderReturnRequestSchema.safeParse({
    ...req.body,
    images: (req.files ?? []) as Express.Multer.File[],
  });
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: parsed.error.issues[0].message,
    });
  }
  try {
    const user = req.user;
    if (!user)
      throw new AppError(
        ErrorCode.UNAUTHORIZED,
        'Lỗi!!!! Chưa xác thực người dùng',
      );
    const order_id = req.params.order_id;
    const order_item_id = Number(req.params.order_item_id);
    const data: orderDto.OrderReturnRequest = parsed.data;
    const order = await orderReturnSerivce.createOrderReturn(
      data,
      user,
      order_id,
      order_item_id,
    );
    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
