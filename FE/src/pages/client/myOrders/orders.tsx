import { useEffect, useRef, useState } from 'react';
import '@/pages/client/myOrders/index.scss';
import { AllOrders } from '@/components/client/statusOrder/allOrders';
import { PendingPay } from '@/components/client/statusOrder/pendingPay';
import { ShippingOrder } from '@/components/client/statusOrder/shippingOrder';
import { ProcessingOrder } from '@/components/client/statusOrder/processingOrder';
import { SuccessOrder } from '@/components/client/statusOrder/successOrder';
import { CancelOrders } from '@/components/client/statusOrder/cancelOrder';
import { ReturnOrder } from '@/components/client/statusOrder/returnOrder';
import type { DataInOrder, OrderAllResponse } from '@/types/clients/client.order.types';
import { useClientOrder } from '@/hooks/client/useClientOrder';

type OptionsFilter =
    | 'ALL'
    | 'PENDING'
    | 'DELIVERING'
    | 'PROCESSING'
    | 'COMPLETED'
    | 'RETURN'
    | 'CANCELLED';

// export enum OrderItemStatus {
//   PENDING = 'PENDING',
//   COMPLETED = 'COMPLETED',
//   RETURNED = 'RETURNED',
//   REFUNDED = 'REFUNDED'
// }

// export enum OrderStatus {
//   PENDING = 'PENDING',//
//   CONFIRMED = 'CONFIRMED',
//   PROCESSING = 'PROCESSING',//
//   DELIVERING = 'DELIVERING',//
//   DELIVERED = 'DELIVERED',//
//   COMPLETED = 'COMPLETED',
//   CANCELLED = 'CANCELLED',//
//   RETURNED = 'RETURNED',//
//   REFUNDED = 'REFUNDED'
// }
export const ClientOrder = () => {
    const [filter, setFilter] = useState<OptionsFilter>('ALL');
    const [refresh, setRefresh] = useState<boolean>(false);
    const [orders, setOrder] = useState<DataInOrder | null>(null);
    const { data: res, loading: loading } = useClientOrder(refresh);

    useEffect(() => {
        setOrder(res?.data ?? null);
    }, [res, refresh]);

    if (loading) return <p> Loading ...</p>;
    const renderFillter = () => {
        switch (filter) {
            case 'PENDING':
                return <PendingPay orders={orders} setRefresh={setRefresh} />;
            case 'DELIVERING':
                return <ShippingOrder orders={orders} />;
            case 'PROCESSING':
                return <ProcessingOrder orders={orders} setRefresh={setRefresh} />;
            case 'COMPLETED':
                return <SuccessOrder orders={orders} />;
            case 'RETURN':
                return <ReturnOrder orders={orders} />;
            case 'CANCELLED':
                return <CancelOrders orders={orders} />;
            default:
                return <AllOrders orders={orders} />;
        }
    };
    // @ts-ignore
    return (
        <div className="client-order">
            <h1 className="client-order__title">Đơn hàng</h1>

            <div className="client-order__filter">
                <button
                    className={`client-order__filter-option ${filter == 'ALL' ? 'client-order__filter-option--active' : ''}`}
                    onClick={() => setFilter('ALL')}
                >
                    Tất cả
                </button>
                <button
                    className={`client-order__filter-option ${filter == 'PENDING' ? 'client-order__filter-option--active' : ''}`}
                    onClick={() => setFilter('PENDING')}
                >
                    Chờ thanh toán
                </button>
                <button
                    className={`client-order__filter-option ${filter == 'PROCESSING' ? 'client-order__filter-option--active' : ''}`}
                    onClick={() => setFilter('PROCESSING')}
                >
                    Đang xử lý
                </button>
                <button
                    className={`client-order__filter-option ${filter == 'DELIVERING' ? 'client-order__filter-option--active' : ''}`}
                    onClick={() => setFilter('DELIVERING')}
                >
                    Đang giao
                </button>
                <button
                    className={`client-order__filter-option ${filter == 'COMPLETED' ? 'client-order__filter-option--active' : ''}`}
                    onClick={() => setFilter('COMPLETED')}
                >
                    Giao hàng thành công
                </button>
                <button
                    className={`client-order__filter-option ${filter == 'RETURN' ? 'client-order__filter-option--active' : ''}`}
                    onClick={() => setFilter('RETURN')}
                >
                    Trả hàng
                </button>
                <button
                    className={`client-order__filter-option ${filter == 'CANCELLED' ? 'client-order__filter-option--active' : ''}`}
                    onClick={() => setFilter('CANCELLED')}
                >
                    Đã hủy
                </button>
            </div>

            {renderFillter()}
        </div>
    );
};
