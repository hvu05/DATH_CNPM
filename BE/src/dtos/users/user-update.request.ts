import {z} from 'zod';

export const UserUpdateSchema = z.object({
  full_name: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional() ,
  phone: z.string().length(10, "Phone number must be 10 digits").optional(),
  avatar: z.string().optional()
})

export type UserUpdateRequest = z.infer<typeof UserUpdateSchema>;