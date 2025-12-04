import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../dtos/common/api-response';
import { CartResponse } from '../dtos/cart/cart-list-response';
import { CartCreateSchema } from '../dtos/cart/cart-create.reques';
import { createCart, deleteCart, getCart, updateCart } from '../services/cart.service';
import { success } from 'zod';

export const createCartHandler = async (
  req: Request,
  res: Response<ApiResponse<CartResponse>>,
  next: NextFunction,
) => {
  const parsed = CartCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: parsed.error.issues[0].message,
    });
  }
  const data = parsed.data;
  const user = req.user;
  if (!user) {
    return res.status(401).json({
      success: false,
      messages: 'Cần đăng nhập để thực hiện tính năng này',
    });
  }
  try {
    const cart = await createCart(data, user);
    const response = { success: true, data: cart };
    res.status(200).json(response);
  } catch (error: Error | any) {
    next(error);
  }
};

export const getCartHandler = async (
  req: Request,
  res: Response<ApiResponse<CartResponse[]>>,
  next: NextFunction,
) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({
      success: false,
      messages: 'Cần đăng nhập để thực hiện tính năng này',
    });
  }
  try {
    const cart = await getCart(user);
    const response = { success: true, data: cart };
    res.status(200).json(response);
  } catch (error: Error | any) {
    next(error);
  }
};

export const deleteCartHandler = async (
  req: Request,
  res: Response<ApiResponse<CartResponse[]>>,
  next: NextFunction,
) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({
      success: false,
      messages: 'Cần đăng nhập để thực hiện tính năng này',
    });
  }
  const cartId = Number(req.params.id);
  if (isNaN(cartId)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid cartId, must be a number',
    });
  }
  try {
    const cart = await deleteCart(cartId,user);
    const response = { success: true, data: cart };
    res.status(200).json(response);
  } catch (error: Error | any) {
    next(error);
  }
};

export const updateCartHandler = async (
  req: Request,
  res: Response<ApiResponse<CartResponse[]>>,
  next: NextFunction,
) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({
      success: false,
      messages: 'Cần đăng nhập để thực hiện tính năng này',
    });
  }
  const cartId = Number(req.params.id);
  if (isNaN(cartId)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid cartId, must be a number',
    });
  }
  const parsed = CartCreateSchema.pick({ quantity: true }).safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: parsed.error.issues[0].message,
    });
  }
  const quantity = parsed.data.quantity;
  try {
    const cart = await updateCart(cartId,quantity ,user);
    const response = { success: true, data: cart };
    res.status(200).json(response);
  } catch (error: Error | any) {
    next(error);
  }
};
