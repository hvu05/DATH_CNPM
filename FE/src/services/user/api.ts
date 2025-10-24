import axios from '@/services/axios.customize'

export interface IGetUsersParams {
    page?: number;
    limit?: number;
    sortBy?: 'create_at';
    sortOrder?: 'asc' | 'desc';
    role?: string[] | null;
    isActive?: boolean[] | null;
    search?: string;
}

export interface IUserStatics {
    totalUsers: number
    activeUsers: number
    staffUsers: number
    customerUsers: number
}

export const getAllUsersAPI = async (params: IGetUsersParams = {}) => {
    const {
        page = 1,
        limit = 10,
        sortBy,
        sortOrder,
        role,
        isActive,
        search
    } = params;

    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());

    if (sortBy) queryParams.append('sortBy', sortBy);
    if (sortOrder) queryParams.append('sortOrder', sortOrder);
    if (role) queryParams.append('roles', role.join(','));
    if (isActive && isActive.length === 1) queryParams.append('isActive', isActive[0] ? 'true' : 'false');
    if (search) queryParams.append('search', search);
    console.log({ queryParams })
    const result = await axios.get<ApiResponse<IUsersPagination>>(
        `${import.meta.env.VITE_BACKEND_URL}/users?${queryParams.toString()}`
    );
    return result.data;
}

export const getUserStaticsAPI = async () => {
    const result = await axios.get<ApiResponse<IUserStatics>>(`${import.meta.env.VITE_BACKEND_URL}/users/static`);
    return result.data;
}

export const getUserRoles = async () => {
    const result = await axios.get<ApiResponse<{ roleID: number, role: Role }[]>>(`${import.meta.env.VITE_BACKEND_URL}/users/roles`);
    return result.data;
}