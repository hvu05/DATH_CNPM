import type { RcFile } from 'antd/es/upload';
import axios from './axios.customize'

export const getProfileAPI = async () => {
    const result = await axios.get<ApiResponse<IUser>>(`${import.meta.env.VITE_BACKEND_URL}/users/profile`);
    return result.data;
}

export const uploadImageAPI = async (file: RcFile) => {
    const formData = new FormData();
    formData.append('image', file);
    const result = await axios.post<ApiResponse<UploadImgResponse>>(`${import.meta.env.VITE_BACKEND_URL}/upload`, formData);
    return result.data;
}

export const deleteImageAPI = async (imageUrl: string) => {
    const result = await axios.delete<ApiResponse<any>>(`${import.meta.env.VITE_BACKEND_URL}/upload`, {
        data: {
            imageUrl: imageUrl,
        }
    });
    return result.data;
}