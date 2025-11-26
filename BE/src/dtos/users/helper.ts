import { User } from "@prisma/client";
import { UserResponse } from "./user.response";
import { prisma } from "../../config/prisma.config";
export const toUserResponse =  (user : User, role : string) : UserResponse => {
  return {
    id : user.id,
    full_name: user.full_name,
    email: user.email,
    phone: user.phone,
    role: role,
    is_active: user.is_active,
    avatar: user.avatar,
    create_at: user.create_at ,
    update_at: user.update_at
  }
}