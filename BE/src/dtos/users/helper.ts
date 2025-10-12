import { User } from "@prisma/client";
import { UserResponse } from "./user.response";

export const toUserResponse = (user : User) : UserResponse => {
  return {
    full_name: user.full_name,
    email: user.email,
    phone: user.phone,
    role: user.role_id === 1 ? 'Customer' : 'Admin',
    is_active: user.is_active,
    avatar: user.avatar
  }
}