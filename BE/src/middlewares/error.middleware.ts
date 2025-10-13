import { error } from "console";
import { ApiResponse } from "../types/api-response";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../exeptions/app-error";
export const errorHanler = (err : any, req: Request, res: Response<ApiResponse<null>>, next: NextFunction) => {
 if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message
    });
  }

  return res.status(500).json({
      success: false,
      error: err.message
  });
}