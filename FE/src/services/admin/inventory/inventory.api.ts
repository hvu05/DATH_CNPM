import axios from '@/services/axios.customize';

export interface IInventoryLog {
    id: number;
    type: 'IN' | 'OUT';
    quantity: number;
    reason: string;
    product_id: number;
    product_variant_id: number;
    product_name: string;
    variant_info: string;
    category: string;
    brand: string;
    price: number;
}

export interface IInventoryLogResponse {
    results: IInventoryLog[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface IInventorySummary {
    totalIn: number;
    totalOut: number;
    totalLogs: number;
}

export interface IInventoryLogParams {
    page?: number;
    limit?: number;
    type?: 'IN' | 'OUT';
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export const getInventoryLogsAPI = async (
    params: IInventoryLogParams = {}
): Promise<ApiResponse<IInventoryLogResponse>> => {
    const { page = 1, limit = 10, type, search, sortBy, sortOrder } = params;

    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());

    if (type) queryParams.append('type', type);
    if (search) queryParams.append('search', search);
    if (sortBy) queryParams.append('sortBy', sortBy);
    if (sortOrder) queryParams.append('sortOrder', sortOrder);

    const result = await axios.get<ApiResponse<IInventoryLogResponse>>(
        `${import.meta.env.VITE_BACKEND_URL}/admin/inventory-logs?${queryParams.toString()}`
    );
    return result.data;
};

export const getInventorySummaryAPI = async (): Promise<ApiResponse<IInventorySummary>> => {
    const result = await axios.get<ApiResponse<IInventorySummary>>(
        `${import.meta.env.VITE_BACKEND_URL}/admin/inventory-logs/summary`
    );
    return result.data;
};
