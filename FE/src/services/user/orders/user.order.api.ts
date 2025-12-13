import axios from '@/services/axios.customize';
import type {
    OrderAllResponse,
    OrderRequest,
    OrderResponse,
    RequestReturnOrder,
    ResponseReturnOrder,
} from '@/types/clients/client.order.types';

export const orderAPI = {
    createOrder: async (params: OrderRequest): Promise<ApiResponse<OrderResponse>> => {
        const res = await axios.post<ApiResponse<OrderResponse>>(`/orders`, params);

        return res.data;
    },
    getOrderByUser: async () => {
        const res = await axios.get<OrderAllResponse>('/orders');

        return res.data;
    },
    returnOrder: async (order_id: string, reason: RequestReturnOrder) => {
        const res = await axios.post<ResponseReturnOrder>(`/orders/${order_id}/return-request`, reason)

        return res.data
    },
    cancelOrder: async (id: string) => {
        const res = await axios.delete<OrderAllResponse>(`/orders/${id}/cancel`);
        return res.data;
    },
};
