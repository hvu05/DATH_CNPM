import axios from '@/services/axios.customize';
import type { OrderRequest, OrderResponse } from '@/types/clients/client.order.types';

export const orderAPI = {
    createOrder: async (params: OrderRequest): Promise<ApiResponse<OrderResponse>> => {
        const res = await axios.post<ApiResponse<OrderResponse>>(`/orders`, params);

        return res.data;
    },
    getOrderByUser: async () => {
        const res = await axios.get('/orders')

        return res 
    }
};
