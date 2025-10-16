import { NextFunction, Request, Response } from "express";

import { login, sendOtpForRegister, register } from "../services/auth.service";
import { ApiResponse } from "../types/api-response";
import { LoginRequest, loginSchema, LoginResponse, RegisterSchema, RegisterRequest } from "../dtos/auth";
import { UserResponse } from "../dtos/users";


export const loginHandler = async (req: Request, res: Response<ApiResponse<LoginResponse>>, next: NextFunction) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: parsed.error.issues[0].message,
    });
  }
  const data: LoginRequest = parsed.data;
  try {
    const response :LoginResponse = await login(data);
    res.json({
      success: true,
      data: response,
    });
  } catch (error) {
    next(error);
  }
};


export const sendOtpForRegisterHandler = async (req: Request, res: Response<ApiResponse<string>>, next: NextFunction) => {
  const { email } = req.body;
  try {
    await sendOtpForRegister(email);
    res.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    next(error);
  }
}

export const registerHandler = async (req: Request, res: Response<ApiResponse<{token: LoginResponse, user : UserResponse}>>, next: NextFunction) => {
   // validation
    const parsed = RegisterSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: parsed.error.issues[0].message
      });
    }
    const data : RegisterRequest = parsed.data;
    data.role = "Customer";
    try{
      const response : ApiResponse<{token: LoginResponse, user : UserResponse}> = { 
        success: true,
        data: {
          user : await register(data),
          token : await login(data)
        }
       };
      res.status(200).json(response);
    } catch (error : Error | any) {
      next(error);
    }
};
