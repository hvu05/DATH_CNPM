import type { IOrder } from '@/services/seller/seller.service';

export const OrderInfoCard = ({ orderData }: { orderData: IOrder }) => {
    return (
        <>
            <div className="seller-order-detail__card">
                <h2 className="seller-order-detail__card-title">Thông tin đơn hàng</h2>
                <div className="seller-order-detail__customer-info">
                    <div className="seller-order-detail__info-group">
                        <p>
                            <span className="seller-order-detail__info-label">Mã đơn hàng:</span>{' '}
                            <span className="seller-order-detail__info-value">#{orderData.id}</span>
                        </p>
                        <p>
                            <span className="seller-order-detail__info-label">Ngày đặt:</span>{' '}
                            <span className="seller-order-detail__info-value">
                                {new Date(orderData.create_at).toLocaleString('vi-VN')}
                            </span>
                        </p>
                        {orderData.deliver_at && (
                            <p>
                                <span className="seller-order-detail__info-label">Ngày giao:</span>{' '}
                                <span className="seller-order-detail__value">
                                    {new Date(orderData.deliver_at).toLocaleString('vi-VN')}
                                </span>
                            </p>
                        )}
                    </div>
                    <div className="seller-order-detail__info-group">
                        <div>
                            <div className="seller-order-detail__info-label">Ghi chú</div>
                            <div className="seller-order-detail__info-value">
                                {orderData.note || 'Không có ghi chú'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
