import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../dtos/common/api-response';
import { CartResponse } from '../dtos/cart/cart-list-response';
import { CartCreateSchema } from '../dtos/cart/cart-create.reques';
import { createCart, getCart, updateCart, removeCartItem } from '../services/cart.service';

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

export const updateCartHandler = async (
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
    const cart = await updateCart(data, user);
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
  const variantId = Number(req.params.variantId);
  const user = req.user;

  if (isNaN(variantId)) {
    return res.status(400).json({
      success: false,
      messages: 'variantId không hợp lệ',
    });
  }

  if (!user) {
    return res.status(401).json({
      success: false,
      messages: 'Cần đăng nhập để thực hiện tính năng này',
    });
  }

  try {
    const remainingCart = await removeCartItem(variantId, user);
    const response = { success: true, data: remainingCart };
    res.status(200).json(response);
  } catch (error: Error | any) {
    next(error);
  }
};
