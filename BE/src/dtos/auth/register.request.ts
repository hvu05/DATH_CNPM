import z from "zod"
import { UserCreateSchema } from "../users"
export const RegisterSchema = UserCreateSchema.extend({
  otp_code : z.string().length(6, "OTP phải có 6 ký tự")
})

export type RegisterRequest = z.infer<typeof RegisterSchema>