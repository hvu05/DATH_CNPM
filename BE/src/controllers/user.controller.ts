import { UserCreateRequest, UserResponse } from "../dtos/users";
import { createUser } from "../services/user.service";
import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../types/api-response";
export const createUserHandler = async (req : Request, res: Response<ApiResponse<UserResponse>>, next: NextFunction) => {
  const data : UserCreateRequest = req.body;
  try{
    const user : UserResponse = await createUser(data);
    const response : ApiResponse<UserResponse> = { success: true, data: user };
    res.status(200).json(response);
  } catch (error : Error | any) {
    next(error);
  }
};