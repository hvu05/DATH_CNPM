import axios from '@/services/axios.customize';
import type { OrderAllResponse, OrderRequest, OrderResponse } from '@/types/clients/client.order.types';

export const orderAPI = {
    createOrder: async (params: OrderRequest): Promise<ApiResponse<OrderResponse>> => {
        const res = await axios.post<ApiResponse<OrderResponse>>(`/orders`, params);

        return res.data;
    },
    getOrderByUser: async () => {
        const res = await axios.get<OrderAllResponse>('/orders')

        return res.data
    },
    // createPayment: async () => {
    //     const res = await axios.get
    // }
    cancelOrder: async (id: string) => {
        const res = await axios.delete<OrderAllResponse>(`/orders/${id}/cancel`)
        return res.data
    }
};
