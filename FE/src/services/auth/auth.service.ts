import axios from '@/services/axios.customize';
import {
    type LoginRequest,
    type LoginResponse,
    type RefreshTokenResponse,
    type RegisterRequest,
    type RegisterResponse,
    type SendOtpRequest,
} from '@/types/auth/auth.types';

export const authAPI = {
    login: async (data: LoginRequest) => {
        const response = await axios.post<ApiResponse<LoginResponse>>('/auth/login', data);
        return response.data;
    },

    refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
        const response = await axios.post('/auth/refresh', {
            refresh_token: refreshToken,
        });
        return response.data;
    },

    logout: async (): Promise<void> => {
        await axios.post('/auth/logout');
    },

    register: async (data: RegisterRequest): Promise<RegisterResponse> => {
        const response = await axios.post('/auth/register', data);
        return response.data.data;
    },

    sendOtp: async (data: SendOtpRequest) => {
        console.log('data', data.email)
        const result = await axios.post<ApiResponse<any>>('/auth/send-otp', data);
        return result.data;
    },
};

export const setTokens = (tokens: LoginResponse) => {
    console.log('settoken method', tokens);
    localStorage.setItem('tokens', JSON.stringify(tokens));
};

export const getTokens = (): LoginResponse | null => {
    const tokens = localStorage.getItem('tokens');
    return tokens ? JSON.parse(tokens) : null;
};

export const removeTokens = () => {
    localStorage.removeItem('tokens');
};

export const isAuthenticated = (): boolean => {
    const tokens = getTokens();
    return !!tokens?.access_token;
};
