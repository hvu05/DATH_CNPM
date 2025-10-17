import { genSalt, hashSync, compareSync } from 'bcrypt-ts' ;
import { UserCreateRequest, UserResponse, toUserResponse } from '../dtos/users';
import { AppError } from '../exeptions/app-error';
import { ErrorCode } from '../exeptions/error-status';
import {prisma} from '../config/prisma.config';

export const createUser = async (
  data : UserCreateRequest
): Promise<UserResponse> => {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  })
  if(user) throw new AppError(ErrorCode.CONFLICT,'User already exists');

  data.password = await hashPassword(data.password);

  let roleObj = await prisma.role.findUnique({
    where: {
      name: data.role.toUpperCase(),
    },
  }) ;
  if(!roleObj){
    roleObj = await prisma.role.findUnique({
      where: {
        name: 'Customer'.toUpperCase(),
      },
    })
  }
  if(!roleObj) throw new AppError(ErrorCode.BAD_REQUEST, "Không tìm thấy Role");
  const { role, ...userData } = data;
  const created = await prisma.user.create({
    data: {
      ...userData,
      role_id : roleObj?.id
  },
    include: {
      role: true
    }
  });
  return toUserResponse(created, created.role.name);
};
export const getProfile = async (id?: string) : Promise<UserResponse> => {
  const user = await prisma.user.findUnique(
    {
      where: {id},
      include: {
        role: true
      }
    })
  if(!user) throw new AppError(ErrorCode.NOT_FOUND, "Không tìm thấy User")
  return toUserResponse(user, user.role.name);
}


const hashPassword = async (password: string): Promise<string> => {
  const salt = await genSalt(10);
  return hashSync(password, salt);
};