import { NextFunction, Request, Response } from 'express';
import { ApiResponse } from '../../dtos/common/api-response';
import * as orderDto from '../../dtos/orders';
import * as orderActionService from '../../services/order/order-action.service';
import { AppError, ErrorCode } from '../../exeptions';

export const staffConfirmOrderHandler = async (
  req: Request,
  res: Response<ApiResponse<orderDto.OrderResponse>>,
  next: NextFunction,
) => {
  try {
    const orderId = req.params.order_id;
    const role = req.user?.role;
    if (role !== 'ADMIN' && role !== 'STAFF')
      throw new AppError(
        ErrorCode.FORBIDDEN,
        'Bạn không có quyền thực hiện thao tác này',
      );
    const order = await orderActionService.confirm(orderId);
    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelOrderHandler = async (
  req: Request,
  res: Response<ApiResponse<orderDto.OrderResponse>>,
  next: NextFunction,
) => {
  try {
    const orderId = req.params.order_id;
    const user = req.user;
    if (!user) {
      throw new AppError(
        ErrorCode.UNAUTHORIZED,
        'Lỗi!!!! Chưa xác thực người dùng',
      );
    }
    let order;
    if (user.role === 'CUSTOMER') {
      order = await orderActionService.cancel(orderId, user.id);
    }
    if (user.role === 'ADMIN' || user.role === 'STAFF') {
      order = await orderActionService.cancel(orderId);
    }
    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const staffProcessingOrderHandler = async (
  req: Request,
  res: Response<ApiResponse<orderDto.OrderResponse>>,
  next: NextFunction,
) => {
  try {
    const orderId = req.params.order_id;
    const order = await orderActionService.process(orderId);
    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const staffDeliverOrderHandler = async (
  req: Request,
  res: Response<ApiResponse<orderDto.OrderResponse>>,
  next: NextFunction,
) => {
  try {
    const orderId = req.params.order_id;
    const order = await orderActionService.deliver(orderId);
    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const staffCompleteOrderHandler = async (
  req: Request,
  res: Response<ApiResponse<orderDto.OrderResponse>>,
  next: NextFunction,
) => {
  try {
    const orderId = req.params.order_id;
    const order = await orderActionService.complete(orderId);
    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const staffRefundOrderHandler = async (
  req: Request,
  res: Response<ApiResponse<orderDto.OrderResponse>>,
  next: NextFunction,
) => {
  try {
    const orderId = req.params.order_id;
    const orderItemId = req.params.order_item_id;
    const order = await orderActionService.refunded(orderId, orderItemId);
    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
