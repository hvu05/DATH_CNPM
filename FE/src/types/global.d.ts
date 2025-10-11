export { }

declare global {
    // example
    interface Response<T> {
        success: boolean;
        data?: T;
        error?: string;
    }

    interface User {
        id: number;
        name: string;
        email: string;
    }
}