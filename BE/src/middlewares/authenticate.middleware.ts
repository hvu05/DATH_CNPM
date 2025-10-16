import { Request,Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.utils";
import { JwtPayload } from "jsonwebtoken";
import { AppError, ErrorCode } from "../exeptions";

export const authenticateHandler = (req: Request, res: Response, next: NextFunction) => {
  try{
    const authHeader = req.headers.authorization ;
    if(!authHeader || !authHeader.startsWith("Bearer ")) throw new AppError(ErrorCode.UNAUTHORIZED, "Chua dang nhap");
    const token = authHeader.split(" ")[1];
    if (!token) throw new AppError(ErrorCode.UNAUTHORIZED, "Chua dang nhap");
    const payload = verifyToken(token) as JwtPayload;
    req.user = payload;
    next();
  }
  catch(error : any){
    next(error);
  }
}