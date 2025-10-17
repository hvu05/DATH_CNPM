import { Request, Response, NextFunction } from "express";
import { AppError, ErrorCode } from "../exeptions";

export const checkRole = (requiredRole: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if(req.user?.role?.toUpperCase() !== requiredRole.toUpperCase()) 
      throw new AppError(ErrorCode.FORBIDDEN, "Bạn không có quyền truy cập chức năng này");
    next();
  };
};


