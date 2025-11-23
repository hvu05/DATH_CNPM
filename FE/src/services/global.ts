import type { RcFile } from 'antd/es/upload';
import axios from './axios.customize';

export const getProfileAPI = async () => {
    const result = await axios.get<ApiResponse<IUser>>(
        `${import.meta.env.VITE_BACKEND_URL}/users/profile`
    );
    return result.data;
};

export const uploadImageAPI = async (file: RcFile, folder: TFolder) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);
    const result = await axios.post<ApiResponse<UploadImgResponse>>(
        `${import.meta.env.VITE_BACKEND_URL}/upload`,
        formData
    );
    return result.data;
};

export const uploadMultipleImgAPI = async (files: RcFile[], folder: TFolder) => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    formData.append('folder', folder as string);
    const result = await axios.post<ApiResponse<UploadImgResponse[]>>(
        `${import.meta.env.VITE_BACKEND_URL}/upload/multiple`,
        formData
    );
    return result.data;
};

export const deleteImageAPI = async (imageUrl: string) => {
    const result = await axios.delete<ApiResponse<any>>(
        `${import.meta.env.VITE_BACKEND_URL}/upload`,
        {
            data: {
                imageUrl: imageUrl,
            },
        }
    );
    return result.data;
};
