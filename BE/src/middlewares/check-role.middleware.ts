import { Request, Response, NextFunction } from "express";
import { AppError, ErrorCode } from "../exeptions";

export const checkRole = (requiredRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    for(const requiredRole of requiredRoles){
      if(req.user?.role?.toUpperCase() === requiredRole.toUpperCase()) return next();
    }
    throw new AppError(ErrorCode.FORBIDDEN, "Bạn không có quyền truy cập chức năng này");
  };
};


