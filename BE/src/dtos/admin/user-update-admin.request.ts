import { z } from 'zod';

export const UserUpdateAdminSchema = z.object({
  role_id: z.number().int().positive().optional(),
  is_active: z.boolean().optional(),
  full_name: z.string().min(1).max(100).optional(),
  avatar: z.string().optional(),
});

export type UserUpdateAdminRequest = z.infer<typeof UserUpdateAdminSchema>;
