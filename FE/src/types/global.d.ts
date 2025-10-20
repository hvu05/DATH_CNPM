export { }

declare global {

    interface ApiResponse<T> {
        success: boolean;
        message?: string;
        data?: T;
        error?: string;
    }

    interface IUser {

    }
}