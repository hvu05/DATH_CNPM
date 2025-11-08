import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    export interface Request {
      user?: JwtPayload & { 
        id?: string; 
        role?: string;
        full_name?: string
        email?: string  
      };
    }
  }
}