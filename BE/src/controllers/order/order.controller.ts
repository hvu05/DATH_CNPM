import { Request, Response, NextFunction } from 'express';

import * as orderDto from '../../dtos/orders';
import * as orderService from '../../services/order/order.service';
import { AppError, ErrorCode } from '../../exeptions';
import { ApiResponse } from '../../types/api-response';

export const createOrderHandler = async (
  req: Request,
  res: Response<ApiResponse<orderDto.OrderResponse>>,
  next: NextFunction,
) => {
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
    if (!user_id)
      throw new AppError(
        ErrorCode.UNAUTHORIZED,
        'Lỗi!!!! Chưa xác thực người dùng',
      );
    const order = await orderService.createOrder(data, user_id);
    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllOrderByUser = async (
  req: Request,
  res: Response<ApiResponse<orderDto.OrderListResponse>>,
  next: NextFunction,
) => {
  try {
    const user_id = req.user?.id;
    if (!user_id)
      throw new AppError(
        ErrorCode.UNAUTHORIZED,
        'Lỗi!!!! Chưa xác thực người dùng',
      );
    const orders = await orderService.getOrdersByUser(user_id);
    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllOrdersHandler = async (
  req: Request,
  res: Response<ApiResponse<orderDto.OrderListResponse>>,
  next: NextFunction,
) => {
  const parsed = orderDto.OrderListQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: parsed.error.issues[0].message,
    });
  }
  const query: orderDto.OrderListQuery = parsed.data;
  const user = req.user;
  if (!user)
    throw new AppError(
      ErrorCode.UNAUTHORIZED,
      'Lỗi!!!! Chưa xác thực người dùng',
    );
  if (user.role !== 'ADMIN' && user.role !== 'STAFF')
    throw new AppError(
      ErrorCode.FORBIDDEN,
      'Bạn không có quyền truy cập chức năng này',
    );
  try {
    const orders = await orderService.getAllOrders(query);
    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};
