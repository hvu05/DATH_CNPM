export { }

declare global {

    interface ApiResponse<T> {
        success: boolean;
        message?: string;
        data?: T;
        error?: string;
    }

    type Role = 'STAFF' | 'CUSTOMER' | 'ADMIN'

    interface IUser {
        "id": string,
        "full_name": string,
        "email": string,
        "phone": string,
        "role": Role,
        "is_active": boolean,
        "avatar": string | null,
        "create_at": Date,
        "update_at": Date
    }

    interface IUsersPagination {
        users: IUser[]
        total: number
        page: number
        limit: number
    }
}