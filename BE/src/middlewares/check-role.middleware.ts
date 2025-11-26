import { Request, Response, NextFunction } from "express";
import { AppError, ErrorCode } from "../exeptions";

type RoleInput = string | string[];

export const checkRole = (roles: RoleInput) => {
  const requiredRoles = Array.isArray(roles) ? roles : [roles];

  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role?.toUpperCase();
    if (!userRole) {
      throw new AppError(ErrorCode.UNAUTHORIZED, "Người dùng chưa đăng nhập");
    }

    const isAllowed = requiredRoles.some(
      (role) => userRole === role.toUpperCase()
    );

    if (!isAllowed) {
      throw new AppError(ErrorCode.FORBIDDEN, "Bạn không có quyền truy cập chức năng này");
    }

    next();
  };
};



