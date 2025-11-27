import { JwtPayload } from 'jsonwebtoken';
export type AuthPayload = JwtPayload & {
  id: string;
  role: string;
  full_name: string;
  email: string;
};
