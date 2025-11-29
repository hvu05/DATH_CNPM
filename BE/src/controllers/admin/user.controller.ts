import * as adminDto from '../../dtos/admin';
import * as adminService from '../../services/admin/users.service';
import { NextFunction, Request, Response } from 'express';
import { ApiResponse } from '../../types/api-response';

// Admin Users APIs - Hades
export const getAllUsersHandler = async (
  req: Request,
  res: Response<ApiResponse<adminDto.UserListResponse>>,
  next: NextFunction,
) => {
  // Validate query parameters với Zod
  const parsed = adminDto.UserListQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: parsed.error.issues[0].message,
    });
  }

  const queryData: adminDto.UserListQueryRequest = parsed.data;

  try {
    const usersList = await adminService.getAllUsers({
      page: queryData.page,
      limit: queryData.limit,
      sortBy: queryData.sortBy,
      sortOrder: queryData.sortOrder,
      roles: queryData.roles,
      isActive: queryData.isActive,
      search: queryData.search,
    });

    const response: ApiResponse<adminDto.UserListResponse> = {
      success: true,
      data: usersList,
    };
    res.status(200).json(response);
  } catch (error: Error | any) {
    next(error);
  }
};

export const getUsersStaticHandler = async (
  req: Request,
  res: Response<ApiResponse<adminDto.UserStaticResponse>>,
  next: NextFunction,
) => {
  try {
    const statistics = await adminService.getUsersStatic();
    const response = { success: true, data: statistics };
    res.status(200).json(response);
  } catch (error: Error | any) {
    next(error);
  }
};

export const getAllRolesHandler = async (
  req: Request,
  res: Response<ApiResponse<adminDto.RoleResponse[]>>,
  next: NextFunction,
) => {
  try {
    const roles = await adminService.getAllRoles();
    const response = { success: true, data: roles };
    res.status(200).json(response);
  } catch (error: Error | any) {
    next(error);
  }
};

export const updateUserByAdminHandler = async (
  req: Request,
  res: Response<ApiResponse<any>>,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    // Validate request body
    const parsed = adminDto.UserUpdateAdminSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: parsed.error.issues[0].message,
      });
    }

    const updateData: adminDto.UserUpdateAdminRequest = parsed.data;
    const updatedUser = await adminService.updateUserByAdmin(id, updateData);

    const response = { success: true, data: updatedUser };
    res.status(200).json(response);
  } catch (error: Error | any) {
    next(error);
  }
};
