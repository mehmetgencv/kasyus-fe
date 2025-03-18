export interface ResponseWrapper<T> {
    data: T;
    responseDate: string;
    message: string;
    success: boolean;
}

export interface ApiResponse<T> {
    data: T | null;
    success: boolean;
    message?: string;
    responseDate?: string;
}