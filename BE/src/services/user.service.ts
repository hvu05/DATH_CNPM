import { PrismaClient } from '@prisma/client';
import { genSalt, hashSync, compareSync } from 'bcrypt-ts' ;
import { UserCreateRequest, UserResponse, toUserResponse } from '../dtos/users';
import { AppError } from '../exeptions/app-error';
import { ErrorCode } from '../exeptions/error-status';
const prisma = new PrismaClient();

export const createUser = async (
  data : UserCreateRequest
): Promise<UserResponse> => {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  })
  if(user) throw new AppError(ErrorCode.USER_EXITED,'User already exists');

  data.password = await hashPassword(data.password);
  const created = await prisma.user.create({
    data,
  });
  return toUserResponse(created);
};

const hashPassword = async (password: string): Promise<string> => {
  const salt = await genSalt(10);
  return hashSync(password, salt);
};