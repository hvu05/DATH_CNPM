//! Filepath: @/services/user/profiles/user.profiles.api.ts
import axios from '@/services/axios.customize';

export const userAPI = {
    /** Lấy thông tin profile người dùng hiện tại */
    getProfile: async () => {
        const res = await axios.get<ApiResponse<IUser>>('/users/profile');
        return res.data;
    },

    /** Cập nhật thông tin profile */
    updateProfile: async (data: Partial<IUser>) => {
        const res = await axios.put<ApiResponse<IUser>>('/users/profile', data);
        return res.data;
    },

    /** Upload avatar */
    uploadAvatar: async (file: File) => {
        const formData = new FormData();
        formData.append('avatar', file);

        const res = await axios.post<ApiResponse<{ avatar: string }>>(
            '/users/profile/avatar',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return res.data;
    },

    /** Đổi mật khẩu */
    changePassword: async (oldPassword: string, newPassword: string) => {
        const res = await axios.post<ApiResponse<any>>('/users/change-password', {
            old_password: oldPassword,
            new_password: newPassword,
        });

        return res.data;
    },
};
