import axios from "axios";
import { getTokens, setTokens, removeTokens } from "./auth/auth.service";

const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

// Add a request interceptor
instance.interceptors.request.use(function (config) {
    const tokens = getTokens();
    if (tokens && tokens.access_token) {
        config.headers.Authorization = `Bearer ${tokens.access_token}`;
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    return response;
}, async function (error) {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried refreshing yet
    if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
            // If refresh is in progress, add request to queue
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return instance(originalRequest);
            }).catch((err) => {
                return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const tokens = getTokens();
        if (!tokens || !tokens.refresh_token) {
            // No refresh token available, logout user
            removeTokens();
            window.location.href = '/login';
            return Promise.reject(error);
        }

        try {
            // Attempt to refresh token
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/refresh`, {
                refresh_token: tokens.refresh_token
            });

            const newTokens = response.data;
            setTokens(newTokens);

            processQueue(null, newTokens.access_token);

            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${newTokens.access_token}`;
            return instance(originalRequest);

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
});

export default instance;