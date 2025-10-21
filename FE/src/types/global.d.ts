export { }

declare global {

    interface ApiResponse<T> {
        success: boolean;
        message?: string;
        data?: T;
        error?: string;
    }

    interface IUser {
        "id": string,
        "full_name": string,
        "email": string,
        "phone": string,
        "role": string,
        "is_active": boolean,
        "avatar": string,
        "create_at": Date,
        "update_at": Date
    }
}