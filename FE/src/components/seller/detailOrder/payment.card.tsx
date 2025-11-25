import type { IOrder } from '@/services/seller/seller.service';

export const PaymentInfoCard = ({ orderData }: { orderData: IOrder }) => {
    return (
        <>
            <div className="seller-order-detail__card">
                <h2 className="seller-order-detail__card-title">Thông tin thanh toán</h2>
                <div className="seller-order-detail__payment-info">
                    <div className="seller-order-detail__info-group">
                        <p>
                            <span className="seller-order-detail__info-label">Phương thức:</span>{' '}
                            <span className="seller-order-detail__info-value">
                                {orderData.payment?.method || 'N/A'}
                            </span>
                        </p>
                        <p>
                            <span className="seller-order-detail__info-label">Trạng thái:</span>{' '}
                            <span className="seller-order-detail__info-value">
                                {orderData.payment?.payment_status || 'N/A'}
                            </span>
                        </p>
                        {orderData.payment?.transaction_code && (
                            <p>
                                <span className="seller-order-detail__info-label">
                                    Mã giao dịch:
                                </span>{' '}
                                <span className="seller-order-detail__info-value">
                                    {orderData.payment.transaction_code}
                                </span>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
