export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    access_token: string,
    refresh_token: string
}

export interface RefreshTokenRequest {
    refresh_token: string;
}

export interface RefreshTokenResponse {
    access_token: string;
    refresh_token: string;
}

export interface RegisterRequest {
    full_name: string;
    email: string;
    password: string;
    phone?: string;
    otp_code: string;
}

export interface RegisterResponse {
    data: IUser;
    tokens: {
        access_token: string,
        refresh_token: string
    }
}

export interface SendOtpRequest {
    email: string;
}
