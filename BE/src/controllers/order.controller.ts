import { Request, Response, NextFunction } from "express";

import * as orderDto from "../dtos/orders";
import * as orderService from "../services/order.service";
import { AppError, ErrorCode } from "../exeptions";

export const createOrderHandler = async (req: Request, res: Response, next: NextFunction) => {
  const parsed = orderDto.OrderCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: parsed.error.issues[0].message,
    });
  }
  const data: orderDto.OrderCreateRequest = parsed.data;
  try {
    const user_id = req.user?.id;
    if (!user_id)  throw new AppError(ErrorCode.UNAUTHORIZED, "Lỗi!!!! Chưa xác thực người dùng");
    const order = await orderService.createOrder(data, user_id);
    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
}