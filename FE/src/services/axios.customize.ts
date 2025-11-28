import axios from 'axios';
import { getTokens, removeTokens } from './auth/auth.service';

const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080',
    withCredentials: true, 
});

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

instance.interceptors.response.use(
    function (response) {
        return response.data ? response.data : response;
    },
    async function (error) {
        if (error.response?.status === 401) {
            removeTokens();
        }
        return Promise.reject(error);
    }
);

export default instance;