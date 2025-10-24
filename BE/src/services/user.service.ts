import { genSalt, hashSync, compareSync } from 'bcrypt-ts';
import * as userDto from '../dtos/users';
import { AppError } from '../exeptions/app-error';
import { ErrorCode } from '../exeptions/error-status';
import { prisma } from '../config/prisma.config';

export const createUser = async (
  data: userDto.UserCreateRequest
): Promise<userDto.UserResponse> => {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  })
  if (user) throw new AppError(ErrorCode.CONFLICT, 'User already exists');

  data.password = await hashPassword(data.password);

  let roleObj = await prisma.role.findUnique({
    where: {
      name: data.role.toUpperCase(),
    },
  });
  if (!roleObj) {
    roleObj = await prisma.role.findUnique({
      where: {
        name: 'Customer'.toUpperCase(),
      },
    })
  }
  if (!roleObj) throw new AppError(ErrorCode.BAD_REQUEST, "Không tìm thấy Role");
  const { role, ...userData } = data;
  const created = await prisma.user.create({
    data: {
      ...userData,
      role_id: roleObj?.id
    },
    include: {
      role: true
    }
  });
  return userDto.toUserResponse(created, created.role.name);
};

/**
 * Lấy thông tin cơ bản của user
 * @param id id của user cần lấy
 * @returns 
 */
export const getUserInfo = async (id?: string): Promise<userDto.UserResponse> => {
  const user = await prisma.user.findUnique(
    {
      where: { id },
      include: {
        role: true
      }
    })
  if (!user) throw new AppError(ErrorCode.NOT_FOUND, "Không tìm thấy User")
  return userDto.toUserResponse(user, user.role.name);
}

export const updateUser = async (data: userDto.UserUpdateRequest, id?: string): Promise<userDto.UserResponse> => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new AppError(ErrorCode.NOT_FOUND, "Không tìm thấy User");
  if (data.password) data.password = await hashPassword(data.password);
  const updated = await prisma.user.update(
    {
      where: { id },
      data,
      include: {
        role: true
      }
    });
  return userDto.toUserResponse(updated, updated.role.name);
}


/**
 * Hash password sử dụng thuật toán bcrypt
 * @param password
 * @returns
 */
const hashPassword = async (password: string): Promise<string> => {
  const salt = await genSalt(10);
  return hashSync(password, salt);
};