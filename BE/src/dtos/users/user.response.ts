import { z } from 'zod';
import { registry } from '../../config/openapi.config';

export const UserResponseSchema = z.object({
  id: z.string(),
  full_name: z.string(),
  email: z.string().email(),
  phone: z.string().nullable().optional(),
  role: z.string().toUpperCase().default('CUSTOMER'),
  is_active: z.boolean(),
  avatar: z.string().nullable().optional(),
  create_at: z.date(),
  update_at: z.date(),
});
registry.register('UserResponse', UserResponseSchema);
export type UserResponse = z.infer<typeof UserResponseSchema>;
