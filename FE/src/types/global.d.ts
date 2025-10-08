export { }

declare global {
    // example
    interface APIResponse<T> {
        success: boolean;
        data: T[];
    }
}