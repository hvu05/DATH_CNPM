import axios from '@/services/axios.customize';
import {
    type ChangePasswordRequest,
    type LoginRequest,
    type LoginResponse,
    type RegisterRequest,
    type RegisterResponse,
    type SendOtpRequest,
    type VerifyOtpRequest,
} from '@/types/auth/auth.types';

export const authAPI = {
    login: async (data: LoginRequest) => {
        const response = await axios.post<ApiResponse<LoginResponse>>('/auth/login', data);
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
        console.log('data', data.email, data?.isRegister);
        const result = await axios.post<ApiResponse<any>>('/auth/send-otp', data);
        return result.data;
    },

    verifyOtp: async (data: VerifyOtpRequest) => {
        const result = await axios.post<ApiResponse<any>>('/auth/verify-otp', data);
        return result.data;
    },

    changePassword: async (data: ChangePasswordRequest) => {
        const result = await axios.post<ApiResponse<any>>('auth/reset-password', data);
        return result.data;
    },
};

export const setTokens = (tokens: LoginResponse) => {
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
