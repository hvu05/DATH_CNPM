import * as userDto from '../dtos/users';
import * as userService from '../services/user.service';
import * as addressService from '../services/address.service';
import { NextFunction, Request, Response } from 'express';
import { ApiResponse } from '../types/api-response';
import { AppError, ErrorCode } from '../exeptions';

export const createUserHandler = async (
  req: Request,
  res: Response<ApiResponse<userDto.UserResponse>>,
  next: NextFunction,
) => {
  // validation
  const parsed = userDto.UserCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: parsed.error.issues[0].message,
    });
  }
  const data: userDto.UserCreateRequest = parsed.data;
  try {
    const user: userDto.UserResponse = await userService.createUser(data);
    const response: ApiResponse<userDto.UserResponse> = {
      success: true,
      data: user,
    };
    res.status(200).json(response);
  } catch (error: Error | any) {
    next(error);
  }
};

export const getProfileHandler = async (
  req: Request,
  res: Response<ApiResponse<userDto.UserResponse>>,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    const profile: userDto.UserResponse = await userService.getUserInfo(
      user?.id,
    );
    const response: ApiResponse<userDto.UserResponse> = {
      success: true,
      data: profile,
    };
    res.status(200).json(response);
  } catch (error: Error | any) {
    next(error);
  }
};

export const updateProfileHandler = async (
  req: Request,
  res: Response<ApiResponse<userDto.UserResponse>>,
  next: NextFunction,
) => {
  const parsed = userDto.UserUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: parsed.error.issues[0].message,
    });
  }
  const data: userDto.UserUpdateRequest = parsed.data;
  try {
    const user = req.user;
    const profile: userDto.UserResponse = await userService.updateUser(
      data,
      user?.id,
    );
    const response: ApiResponse<userDto.UserResponse> = {
      success: true,
      data: profile,
    };
    res.status(200).json(response);
  } catch (error: Error | any) {
    next(error);
  }
};

export const getUserByIdHandler = async (
  req: Request,
  res: Response<ApiResponse<userDto.UserResponse>>,
  next: NextFunction,
) => {
  try {
    const userId = req.params.user_id;
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required',
      });
    }

    const user: userDto.UserResponse = await userService.getUserInfo(userId);
    const response: ApiResponse<userDto.UserResponse> = {
      success: true,
      data: user,
    };
    res.status(200).json(response);
  } catch (error: Error | any) {
    next(error);
  }
};

export const createAddressHandler = async (
  req: Request,
  res: Response<ApiResponse<userDto.AddressListResponse>>,
  next: NextFunction,
) => {
  const parsed = userDto.AddressCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: parsed.error.issues[0].message,
    });
  }
  const data: userDto.AddressCreateRequest = parsed.data;
  try {
    const user = req.user;
    const profile = await addressService.createAddress(data, user?.id);
    const response = { success: true, data: profile };
    res.status(200).json(response);
  } catch (error: Error | any) {
    next(error);
  }
};

export const getAddressListHandler = async (
  req: Request,
  res: Response<ApiResponse<userDto.AddressListResponse>>,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    if (!user)
      throw new AppError(
        ErrorCode.UNAUTHORIZED,
        'Lỗi!!!! Chưa xác thực người dùng',
      );
    const addresses = await addressService.getAddressList(user.id);
    const response = { success: true, data: addresses };
    res.status(200).json(response);
  } catch (error: Error | any) {
    next(error);
  }
};

export const updateAddressHandler = async (
  req: Request,
  res: Response<ApiResponse<userDto.AddressListResponse>>,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    if (!user)
      throw new AppError(
        ErrorCode.UNAUTHORIZED,
        'Lỗi!!!! Chưa xác thực người dùng',
      );
    const addressId = Number(req.params.id);
    const parsed = userDto.AddressCreateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: parsed.error.issues[0].message,
      });
    }
    const data: userDto.AddressCreateRequest = parsed.data;
    const address = await addressService.updateAddress(
      addressId,
      user.id,
      data,
    );
    const response = { success: true, data: address };
    res.status(200).json(response);
  } catch (error: Error | any) {
    next(error);
  }
};

export const deleteAddressHandler = async (
  req: Request,
  res: Response<ApiResponse<userDto.AddressListResponse>>,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    if (!user)
      throw new AppError(
        ErrorCode.UNAUTHORIZED,
        'Lỗi!!!! Chưa xác thực người dùng',
      );
    const addressId = Number(req.params.address_id);
    const address = await addressService.deleteAddress(addressId, user.id);
    const response = { success: true, data: address };
    res.status(200).json(response);
  } catch (error: Error | any) {
    next(error);
  }
};
