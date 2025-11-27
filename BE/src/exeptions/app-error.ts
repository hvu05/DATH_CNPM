import { ErrorCode } from './error-status';

export class AppError extends Error {
  statusCode: number;
  constructor(code: ErrorCode, message: string) {
    super(message);
    this.statusCode = code.valueOf();
  }
}
