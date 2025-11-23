import axios from '@/services/axios.customize';

export const DEFAULT_SORTBY: TSortColumn = 'create_at';
export const DEFAUTLT_SORTORDER: SortOrder = 'asc';
export type TSortColumn = 'create_at';
export type SortOrder = 'desc' | 'asc';
export type OrderStatus =
    | 'PENDING'
    | 'CONFIRMED'
    | 'PROCESSING'
    | 'DELIVERING'
    | 'DELIVERED'
    | 'COMPLETED'
    | 'CANCELLED'
    | 'RETURNED'
    | 'REFUNDED';

export interface IGetOrdersParams {
    page: number;
    limit: number;
    sortBy?: TSortColumn;
    sortOrder?: SortOrder;
    status?: OrderStatus;
    min_price?: number;
    max_price?: number;
    search?: string;
    start_date?: Date;
    end_date?: Date;
}

export interface IPayment {
    id: string;
    order_id: string;
    amount: number;
    method: string;
    payment_status: string;
    transaction_code: string;
    create_at: Date;
    update_at: Date;
    user_id: string;
}

export interface IOrderItem {
    id: string;
    price_per_item: string;
    quantity: number;
    product_variant: {
        id: number;
        product_id: number;
        color: string;
        storage: string;
        name: string;
        price: number;
    };
}

export interface IOrder {
    id: string;
    user_id: string;
    total: number;
    status: string;
    address: {
        id: string;
        province: string;
        ward: string;
        detail: string;
    };
    note: string;
    create_at: Date;
    deliver_at: Date;
    payment: IPayment;
    order_items: IOrderItem[];
}

export interface IOrders {
    count: number;
    orders: IOrder[];
}

export const updateProfileSellerAPI = async (full_name: string, phone: string) => {
    const result = await axios.put<ApiResponse<IUser>>(
        `${import.meta.env.VITE_BACKEND_URL}/users/profile`,
        {
            full_name: full_name,
            phone: phone,
        }
    );
    return result.data;
};

export const getAllOrders = async (params: IGetOrdersParams) => {
    const urlParam = new URLSearchParams();
    urlParam.append('page', params.page.toString());
    urlParam.append('limit', params.limit.toString());

    if (params.search) {
        urlParam.append('search', params.search);
    }
    if (params.max_price) {
        urlParam.append('max_price', params.max_price.toString());
    }
    if (params.min_price) {
        urlParam.append('max_price', params.min_price.toString());
    }
    if (params.status) {
        urlParam.append('status', params.status);
    }
    urlParam.append('sortBy', params.sortBy ?? DEFAULT_SORTBY);
    urlParam.append('sort_order', params.sortOrder ?? DEFAUTLT_SORTORDER);
    const result = await axios.get<ApiResponse<IOrders>>(
        `${import.meta.env.VITE_BACKEND_URL}/orders/all?${urlParam.toString()}`
    );
    return result.data;
};
