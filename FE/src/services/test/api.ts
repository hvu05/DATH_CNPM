import axios from "../axios.customize"

// "https://eccommerce-nestjs.onrender.com/"
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export interface APIResponse<T> {
    message: string;
    data?: T;
    error?: string;
    statusCode: number;
}

export type TRole = 'admin' | 'seller' | 'customer';


export interface IUser {
    _id: string;
    email: string;
    fullName: string;
    isActive: boolean;
    role: TRole;
    createdAt: Date;
    updatedAt: Date;
}


export const getAllUsers = async () => {
    const result = await axios.get<APIResponse<IUser[]>>(`${BACKEND_URL}/users`);
    return result.data;
}

export const updateUserByID = async (_id: string, fullName: string, email: string, role: TRole, isActive: boolean) => {
    const data = { fullName: fullName, email, role, isActive, _id };
    const result = await axios.put<APIResponse<IUser>>(`${BACKEND_URL}/users/${_id}`, data);
    console.log(result);
    return result.data;
}