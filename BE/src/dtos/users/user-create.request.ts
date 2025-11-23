import { z } from "zod";

export const UserCreateSchema = z.object( {
  full_name: z.string().nonempty(),
  email: z.string().email("Invalid email").nonempty(),
  password: z.string().min(6, "Password must be at least 6 characters").nonempty() ,
  phone: z.string().length(10, "Phone number must be 10 digits").optional(),
  role: z.string().toUpperCase().default("CUSTOMER"),
})

export type UserCreateRequest = z.infer<typeof UserCreateSchema>