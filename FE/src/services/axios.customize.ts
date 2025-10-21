import axios from "axios";
import { getTokens, setTokens, removeTokens } from "./auth/auth.service";

const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
});

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
    // const originalRequest = error.config;

    // If error is 401 and we haven't tried refreshing yet
    if (error.response?.status === 401) {
        // originalRequest._retry = true;
        const tokens = getTokens();
        if (!tokens || !tokens.refresh_token) {
            // No refresh token available, logout user
            removeTokens();
            window.location.href = '/login';
            return Promise.reject(error);
        }

        try {
            // Attempt to refresh token
            // const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/refresh`, {
            //     refresh_token: tokens.refresh_token
            // });

            // const newTokens = response.data;
            // setTokens(newTokens);
            // // Retry original request with new token
            // originalRequest.headers.Authorization = `Bearer ${newTokens.access_token}`;
            // return instance(originalRequest);
            window.location.href = '/login';
        } catch (refreshError) {
            // Refresh failed, logout user
            removeTokens();
            window.location.href = '/login';
            return Promise.reject(refreshError);
        }
    }

    return Promise.reject(error);
});

export default instance;