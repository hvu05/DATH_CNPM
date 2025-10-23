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
 * Lấy danh sách tất cả users (chỉ admin mới được quyền)
 * @param options các tùy chọn filter và sort
 * @returns danh sách users và tổng số
 */
export const getAllUsers = async (options: userDto.UserListQueryRequest): Promise<userDto.UserListResponse> => {
  const { page, limit, sortBy = 'create_at', sortOrder = 'desc', roles, isActive, search } = options;
  const skip = (page - 1) * limit;

  // Build where clause for filtering
  const where: any = {};

  // Filter by multiple roles
  if (roles && roles.length > 0) {
    where.role = {
      name: {
        in: roles
      }
    };
  }

  // Filter by active status
  if (isActive && isActive.length > 0) {
    // If only filtering for true or false
    if (isActive.length === 1) {
      where.is_active = isActive[0];
    }
    // If filtering for both true and false, no need to filter
    // else: don't add is_active filter (returns all)
  }

  // Search by name or email
  if (search) {
    where.OR = [
      { full_name: { contains: search } },
      { email: { contains: search } }
    ];
  }

  // Build orderBy clause - sort by create_at only
  const orderBy: any = { create_at: sortOrder };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      where,
      include: {
        role: true
      },
      orderBy
    }),
    prisma.user.count({ where })
  ]);

  const userResponses = users.map(user => userDto.toUserResponse(user, user.role.name));

  return {
    users: userResponses,
    total,
    page,
    limit,
    filters: {
      sortBy,
      sortOrder,
      roles,
      isActive,
      search
    }
  };
};

/**
 * Hash password sử dụng thuật toán bcrypt
 * @param password
 * @returns
 */
const hashPassword = async (password: string): Promise<string> => {
  const salt = await genSalt(10);
  return hashSync(password, salt);
};