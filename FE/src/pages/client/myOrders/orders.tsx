import { useState } from 'react';
import '@/pages/client/myOrders/index.scss';
import { AllOrders } from '@/components/client/statusOrder/allOrders';
import { PendingPay } from '@/components/client/statusOrder/pendingPay';
import { ShippingOrder } from '@/components/client/statusOrder/shippingOrder';
import { ProcessingOrder } from '@/components/client/statusOrder/processingOrder';
import { SuccessOrder } from '@/components/client/statusOrder/successOrder';
import { CancelOrders } from '@/components/client/statusOrder/cancelOrder';
import { ReturnOrder } from '@/components/client/statusOrder/returnOrder';

type OptionsFilter =
    | 'all'
    | 'pending_pay'
    | 'shipping'
    | 'processing'
    | 'succeeded'
    | 'return'
    | 'cancelled';

export const ClientOrder = () => {
    const [filter, setFilter] = useState<OptionsFilter>('all');

    const renderFillter = () => {
        switch (filter) {
            case 'pending_pay':
                return <PendingPay />;
            case 'shipping':
                return <ShippingOrder />;
            case 'processing':
                return <ProcessingOrder />;
            case 'succeeded':
                return <SuccessOrder />;
            case 'return':
                return <ReturnOrder />;
            case 'cancelled':
                return <CancelOrders />;
            default:
                return <AllOrders />;
        }
    };
    // @ts-ignore
    return (
        <div className="client-order">
            <h1 className="client-order__title">Đơn hàng</h1>

            <div className="client-order__filter">
                <button
                    className={`client-order__filter-option ${filter == 'all' ? 'client-order__filter-option--active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    Tất cả
                </button>
                <button
                    className={`client-order__filter-option ${filter == 'pending_pay' ? 'client-order__filter-option--active' : ''}`}
                    onClick={() => setFilter('pending_pay')}
                >
                    Đang chờ thanh toán
                </button>
                <button
                    className={`client-order__filter-option ${filter == 'processing' ? 'client-order__filter-option--active' : ''}`}
                    onClick={() => setFilter('processing')}
                >
                    Đang xử lý
                </button>
                <button
                    className={`client-order__filter-option ${filter == 'shipping' ? 'client-order__filter-option--active' : ''}`}
                    onClick={() => setFilter('shipping')}
                >
                    Đang giao
                </button>
                <button
                    className={`client-order__filter-option ${filter == 'succeeded' ? 'client-order__filter-option--active' : ''}`}
                    onClick={() => setFilter('succeeded')}
                >
                    Giao hàng thành công
                </button>
                <button
                    className={`client-order__filter-option ${filter == 'return' ? 'client-order__filter-option--active' : ''}`}
                    onClick={() => setFilter('return')}
                >
                    Trả hàng
                </button>
                <button
                    className={`client-order__filter-option ${filter == 'cancelled' ? 'client-order__filter-option--active' : ''}`}
                    onClick={() => setFilter('cancelled')}
                >
                    Hủy hàng
                </button>
            </div>

            {renderFillter()}
        </div>
    );
};
