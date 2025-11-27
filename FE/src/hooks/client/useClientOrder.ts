import { useEffect, useState } from 'react';
import { orderAPI } from '@/services/user/orders/user.order.api';
import type { OrderAllResponse } from '@/types/clients/client.order.types';

export const useClientOrder = (refresh: boolean) => {
    const [order, setOrder] = useState<OrderAllResponse>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await orderAPI.getOrderByUser();
                if (res) {
                    setLoading(false);
                    setOrder(res);
                    console.log('res fetch', res);
                }
            } catch (err) {
                setLoading(false);
            }
        };
        fetchData();
    }, [refresh]);

    return {
        data: order,
        loading: loading,
    };
};
