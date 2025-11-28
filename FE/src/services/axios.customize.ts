import axios from 'axios';
import { getTokens, setTokens, removeTokens } from './auth/auth.service';

const instance = axios.create({
    // Nếu biến môi trường chưa có, dùng mặc định http://localhost:8080
    // Backend của bạn không có prefix /api/v1 nên trỏ thẳng vào root
    baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080',
    withCredentials: true, // Quan trọng để Backend nhận diện CORS
});

// Add a request interceptor
instance.interceptors.request.use(
    function (config) {
        // Code này giữ nguyên để sau này dùng cho chức năng đăng nhập
        const tokens = getTokens();
        if (tokens && tokens.access_token) {
            config.headers.Authorization = `Bearer ${tokens.access_token}`;
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

// Add a response interceptor
instance.interceptors.response.use(
    function (response) {
        // === THAY ĐỔI QUAN TRỌNG NHẤT ===
        // Trả về data thực tế luôn để Frontend đỡ phải gọi .data nhiều lần
        // Backend thường trả về: { message: "...", data: [...] } hoặc [...]
        return response.data ? response.data : response;
    },
    async function (error) {
        // const originalRequest = error.config;

        // Xử lý lỗi 401 (Hết hạn token) - Giữ nguyên logic của bạn
        if (error.response?.status === 401) {
            // Guest User (Khách) thì không quan tâm lỗi này ở trang chủ
            // Logic này chỉ chạy khi user đã đăng nhập mà token hết hạn
            const tokens = getTokens();
            if (!tokens || !tokens.refresh_token) {
                removeTokens();
                // window.location.href = '/login'; // Tạm comment để Guest không bị redirect oan
                return Promise.reject(error);
            }

            try {
                // Logic refresh token (giữ nguyên hoặc mở comment khi cần)
                // const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/refresh`, {
                //     refresh_token: tokens.refresh_token
                // });
                // ...
                
                // Tạm thời logout nếu lỗi auth để tránh loop
                removeTokens();
                // window.location.href = '/login';
                return Promise.reject(error);
            } catch (refreshError) {
                removeTokens();
                // window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default instance;