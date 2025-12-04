import axios from 'axios';
import { getTokens, setTokens, removeTokens } from './auth/auth.service';
import type { LoginResponse, RefreshTokenResponse } from '@/types/auth/auth.types';

const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
});

// Flag to prevent multiple refresh token requests
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token!);
        }
    });
    failedQueue = [];
};

// Add a request interceptor
instance.interceptors.request.use(
    function (config) {
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
        return response;
    },
    async function (error) {
        const originalRequest = error.config;

        // Check if error is due to expired token
        if (
            error.response?.data?.message === import.meta.env.VITE_RESPONSE_REFRESH_TOKEN &&
            !originalRequest._retry
        ) {
            const tokens = getTokens();

            if (!tokens || !tokens.refresh_token) {
                removeTokens();
                window.location.href = '/login';
                return Promise.reject(error);
            }

            // If already refreshing, queue this request
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(token => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return instance(originalRequest);
                    })
                    .catch(err => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Attempt to refresh token
                const response = await axios.post<ApiResponse<RefreshTokenResponse>>(
                    `${import.meta.env.VITE_BACKEND_URL}/auth/refresh-token`,
                    {
                        refresh_token: tokens.refresh_token,
                    }
                );

                if (response.data && response.data.data && response.data.success) {
                    const newTokens = response.data.data;
                    console.log('Refresh token successful, new tokens:', newTokens);
                    setTokens(newTokens as LoginResponse);

                    // Process queued requests
                    processQueue(null, newTokens?.access_token);

                    // Retry original request with new token
                    originalRequest.headers.Authorization = `Bearer ${newTokens?.access_token}`;
                    return instance(originalRequest);
                }
            } catch (refreshError) {
                processQueue(refreshError, null);
                removeTokens();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default instance;
