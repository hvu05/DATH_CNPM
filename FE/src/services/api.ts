import axios from './axios.customize'

export const getUsersAPI = async () => {
    const result = await axios.get<ApiResponse<IUser[]>>('/users');
    return result.data;
}