import * as adminDto from '../dtos/admin';
import { prisma } from '../config/prisma.config';

/**
 * Lấy danh sách tất cả users (chỉ admin mới được quyền)
 * @param options các tùy chọn filter và sort
 * @returns danh sách users và tổng số
 */
export const getAllUsers = async (options: adminDto.UserListQueryRequest): Promise<adminDto.UserListResponse> => {
  const { page, limit, sortBy = 'create_at', sortOrder = 'desc', roles, isActive, search } = options;
  const skip = (page - 1) * limit;

  // Build where clause for filtering
  const where: any = {};

  // Filter by multiple roles
  if (roles && roles.length > 0) {
    // Get role IDs first
    const roleRecords = await prisma.role.findMany({
      where: {
        name: {
          in: roles
        }
      },
      select: { id: true }
    });

    if (roleRecords.length > 0) {
      where.role_id = {
        in: roleRecords.map(r => r.id)
      };
    } else {
      // If no roles found, return empty result
      return {
        users: [],
        total: 0,
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
    }
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

  const userResponses = users.map(user => {
    return {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      is_active: user.is_active,
      role: user.role.name,
      create_at: user.create_at,
      update_at: user.update_at
    };
  });

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

export const getUsersStatic = async (): Promise<adminDto.UserStaticResponse> => {
  // Get role IDs first
  const [staffRole, customerRole] = await Promise.all([
    prisma.role.findUnique({ where: { name: 'STAFF' } }),
    prisma.role.findUnique({ where: { name: 'CUSTOMER' } })
  ]);

  const [totalUsers, activeUsers, staffUsers, customerUsers] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({
      where: { is_active: true }
    }),
    prisma.user.count({
      where: staffRole ? { role_id: staffRole.id } : { role_id: -1 } // Use invalid ID if role not found
    }),
    prisma.user.count({
      where: customerRole ? { role_id: customerRole.id } : { role_id: -1 }
    }),
  ])
  return {
    totalUsers,
    activeUsers,
    staffUsers,
    customerUsers
  }
}

export const getAllRoles = async (): Promise<adminDto.RoleResponse[]> => {
  const roles = await prisma.role.findMany({
    select: {
      id: true,
      name: true
    },
    orderBy: {
      id: 'asc'
    }
  });

  return roles;
}

export const updateUserByAdmin = async (userId: string, data: adminDto.UserUpdateAdminRequest) => {
  // Check if user exists
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error('User not found');
  }

  // Validate role_id if provided
  if (data.role_id !== undefined) {
    const role = await prisma.role.findUnique({ where: { id: data.role_id } });
    if (!role) {
      throw new Error('Invalid role_id');
    }
  }

  // Update user
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(data.role_id !== undefined && { role_id: data.role_id }),
      ...(data.is_active !== undefined && { is_active: data.is_active }),
      ...(data.full_name && { full_name: data.full_name }),
      ...(data.avatar !== undefined && { avatar: data.avatar }),
    },
    include: {
      role: true
    }
  });

  return {
    id: updatedUser.id,
    full_name: updatedUser.full_name,
    email: updatedUser.email,
    phone: updatedUser.phone,
    avatar: updatedUser.avatar,
    is_active: updatedUser.is_active,
    role: updatedUser.role.name,
    create_at: updatedUser.create_at,
    update_at: updatedUser.update_at
  };
}