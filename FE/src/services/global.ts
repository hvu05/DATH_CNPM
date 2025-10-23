import axios from './axios.customize'

export const getProfileAPI = async () => {
    const result = await axios.get<ApiResponse<IUser>>(`${import.meta.env.VITE_BACKEND_URL}/users/profile`);
    return result.data;
}

