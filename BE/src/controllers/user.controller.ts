import { UserCreateRequest, UserResponse, UserCreateSchema } from "../dtos/users";
import { createUser, getProfile } from "../services/user.service";
import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../types/api-response";

/* 
  * Sẽ loại bỏ api này trong tương lai
*/
export const createUserHandler = async (req : Request, res: Response<ApiResponse<UserResponse>>, next: NextFunction) => {
  // validation
  const parsed = UserCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: parsed.error.issues[0].message
    });
  }
  const data : UserCreateRequest = parsed.data;
  try{
    const user : UserResponse = await createUser(data);
    const response : ApiResponse<UserResponse> = { success: true, data: user };
    res.status(200).json(response);
  } catch (error : Error | any) {
    next(error);
  }
};

export const getProfileHandler = async (req : Request, res: Response<ApiResponse<UserResponse>>, next: NextFunction) => {
  try{
    const user = req.user ;
    const profile : UserResponse = await getProfile(user?.id); 
    const response : ApiResponse<UserResponse> = { success: true, data: profile };
    res.status(200).json(response);
  }
  catch (error : Error | any) {
    next(error);
  }
}