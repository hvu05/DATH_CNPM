import axios from '@/services/axios.customize';

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

interface IUser {
    id: string;
    full_name: string;
    email: string;
    phone: string;
}

export interface ICustomer {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    role: Role;
    is_active: boolean;
    avatar: string;
    create_at: Date;
    update_at: Date;
}
export const DEFAULT_SORTBY: TSortColumn = 'create_at';
export const DEFAUTLT_SORTORDER: SortOrder = 'asc';
export type TSortColumn = 'create_at';
export type SortOrder = 'desc' | 'asc';
export type OrderStatus =
    | 'PENDING'
    | 'PROCESSING'
    | 'DELIVERING'
    | 'COMPLETED'
    | 'CANCELLED'
    | 'RETURNED'
    | 'REFUNDED'
    | 'RETURN_REQUEST';
export type PaymentStatus = 'SUCCESS' | 'FAILED' | 'PENDING';
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
    payment_status: PaymentStatus;
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
        thumbnail: string;
    };
}

export interface IOrder {
    id: string;
    user_id: string;
    total: number;
    status: OrderStatus;
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
    filter: {
        page: number;
        limit: number;
    };
}

export interface IOrders {
    count: number;
    orders: IOrder[];
}

export interface IOrderItemReq {
    orders: IOrder;
}
export interface IOrderReturnRequest {
    order: IOrderItemReq;
    reason: string;
    images: string[];
    create_at: Date;
    update_at: Date;
    order_item: IOrderItem;
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

export const getUserById = async (userId: string) => {
    const result = await axios.get<ApiResponse<ICustomer | null>>(
        `${import.meta.env.VITE_BACKEND_URL}/users/${userId}`
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
        urlParam.append('min_price', params.min_price.toString());
    }
    if (params.status) {
        urlParam.append('status', params.status);
    }
    if (params.start_date) {
        urlParam.append('start_date', params.start_date.toDateString());
    }
    if (params.end_date) {
        urlParam.append('end_date', params.end_date.toDateString());
    }
    urlParam.append('sortBy', params.sortBy ?? DEFAULT_SORTBY);
    urlParam.append('sort_order', params.sortOrder ?? DEFAUTLT_SORTORDER);
    const result = await axios.get<ApiResponse<IOrders>>(
        `${import.meta.env.VITE_BACKEND_URL}/orders/all?${urlParam.toString()}`
    );
    return result.data;
};

export const acceptDeliverAPI = async (order_id: string) => {
    const result = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/orders/${order_id}/deliver`
    );
    return result.data;
};

export const completeDeliverAPI = async (order_id: string) => {
    const result = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/orders/${order_id}/complete`
    );
    return result.data;
};

export const acceptReturnRqAPI = async (order_id: string, order_item_id: string) => {
    const result = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/orders/${order_id}/return-confirm/${order_item_id}`
    );
    return result.data;
};

export const getInforOrderReq = async (order_id: string, order_item_id: string) => {
    const result = await axios.get<ApiResponse<IOrderReturnRequest>>(
        `${import.meta.env.VITE_BACKEND_URL}/orders/${order_id}/return/${order_item_id}/detail`
    );
    return result.data;
};
