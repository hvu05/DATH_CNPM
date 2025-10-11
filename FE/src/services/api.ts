import axios from './axios.customize'

export const getUsersAPI = async () => {
    const result = await axios.get<Response<User[]>>(`${import.meta.env.VITE_BACKEND_URL}/users`);
    return result.data;
}