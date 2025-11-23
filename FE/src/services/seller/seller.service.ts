import axios from '@/services/axios.customize';

export const updateProfileSellerAPI = async (full_name: string, phone: string) => {
    const result = await axios.put<ApiResponse<IUser>>(
        `${import.meta.env.VITE_BACKEND_URL}/users/profile`,
        {
            full_name: full_name,
            phone: phone,
        }
    );
    return result.data;
};
