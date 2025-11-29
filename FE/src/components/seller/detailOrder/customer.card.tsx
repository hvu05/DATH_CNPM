import type { ICustomer, IOrder } from '@/services/seller/seller.service';
import { Skeleton } from 'antd';

export const CustomerCard = ({
    customerInfo,
    loadingCustomer,
    orderData,
}: {
    customerInfo: ICustomer | null;
    loadingCustomer: boolean;
    orderData: IOrder;
}) => {
    return (
        <>
            <div className="seller-order-detail__card">
                <h2 className="seller-order-detail__card-title">Thông tin khách hàng</h2>
                <div className="seller-order-detail__customer-info">
                    {loadingCustomer ? (
                        <Skeleton active paragraph={{ rows: 3 }} />
                    ) : (
                        <>
                            <div className="seller-order-detail__info-group">
                                <p>
                                    <span className="seller-order-detail__info-label">
                                        Họ và tên:
                                    </span>{' '}
                                    <span className="seller-order-detail__info-value">
                                        {customerInfo?.full_name || 'Chưa có thông tin'}
                                    </span>
                                </p>
                                <p>
                                    <span className="seller-order-detail__info-label">Email:</span>{' '}
                                    <span className="seller-order-detail__info-value">
                                        {customerInfo?.email || 'Chưa có thông tin'}
                                    </span>
                                </p>
                                <p>
                                    <span className="seller-order-detail__info-label">
                                        Số điện thoại:
                                    </span>{' '}
                                    <span className="seller-order-detail__info-value">
                                        {customerInfo?.phone ||
                                            customerInfo?.phone ||
                                            'Chưa có thông tin'}
                                    </span>
                                </p>
                                <p>
                                    <span className="seller-order-detail__info-label">
                                        Mã khách hàng:
                                    </span>{' '}
                                    <span className="seller-order-detail__info-value">
                                        {orderData.user_id}
                                    </span>
                                </p>
                            </div>
                            <div className="seller-order-detail__info-group seller-order-detail__info-group--address">
                                <div>
                                    <div className="seller-order-detail__info-label">
                                        Địa chỉ giao hàng
                                    </div>
                                    <div className="seller-order-detail__info-value">
                                        {orderData.address?.detail &&
                                        orderData.address?.ward &&
                                        orderData.address?.province
                                            ? `${orderData.address.detail}, ${orderData.address.ward}, ${orderData.address.province}`
                                            : 'Chưa có địa chỉ'}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};
