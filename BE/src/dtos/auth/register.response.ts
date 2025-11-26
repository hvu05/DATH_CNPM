import z from "zod";
import { UserResponseSchema } from "../users";
import { LoginResponseSchema } from "./login.response";

export const RegisterResponseSchema = z.object({
  user : UserResponseSchema,
  token: LoginResponseSchema
})

export type RegisterResponse = z.infer<typeof RegisterResponseSchema>