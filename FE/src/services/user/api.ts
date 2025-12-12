import axios from '@/services/axios.customize';

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
    totalUsers: number;
    activeUsers: number;
    staffUsers: number;
    customerUsers: number;
}

export interface IUpdateUserParams {
    full_name: string;
    role_id: number;
    is_active: boolean;
    avatar: string;
}

export const getAllUsersAPI = async (params: IGetUsersParams = {}) => {
    const { page = 1, limit = 10, sortBy, sortOrder, role, isActive, search } = params;

    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());

    if (sortBy) queryParams.append('sortBy', sortBy);
    if (sortOrder) queryParams.append('sortOrder', sortOrder);
    if (role) queryParams.append('roles', role.join(','));
    if (isActive && isActive.length === 1)
        queryParams.append('isActive', isActive[0] ? 'true' : 'false');
    if (search) queryParams.append('search', search);
    const result = await axios.get<ApiResponse<IPagination<IUser[]>>>(
        `${import.meta.env.VITE_BACKEND_URL}/admin/users?${queryParams.toString()}`
    );
    return result.data;
};

export const getUserStaticsAPI = async () => {
    const result = await axios.get<ApiResponse<IUserStatics>>(
        `${import.meta.env.VITE_BACKEND_URL}/admin/users/static`
    );
    return result.data;
};

export const getUserRoles = async () => {
    const result = await axios.get<ApiResponse<{ id: number; name: Role }[]>>(
        `${import.meta.env.VITE_BACKEND_URL}/admin/users/roles`
    );
    return result.data;
};

export const updateUserAPI = async (userId: string, params: IUpdateUserParams) => {
    const result = await axios.put<ApiResponse<IUser>>(
        `${import.meta.env.VITE_BACKEND_URL}/admin/users/${userId}`,
        params
    );
    return result.data;
};
