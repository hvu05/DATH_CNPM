import jwt, {
  JwtPayload,
  JsonWebTokenError,
  TokenExpiredError,
} from 'jsonwebtoken';
import { StringValue } from 'ms';
import { AppError, ErrorCode } from '../exeptions';
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

export const generateToken = (
  payload: JwtPayload,
  expiresIn: StringValue = '1d',
): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: expiresIn });
};

export const verifyToken = (token: string): JwtPayload| string => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error: any) {
    let message: string = '';
    if (error instanceof TokenExpiredError) {
      message = 'Token đã hết hạn';
    }
    if (error instanceof JsonWebTokenError) {
      message = 'Token không hợp lệ';
    }
    throw new AppError(ErrorCode.BAD_REQUEST, message);
  }
};
