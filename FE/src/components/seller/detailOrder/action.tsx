import { delay, formatCurrency } from '@/helpers/seller/helper';
import {
    acceptDeliverAPI,
    acceptReturnRqAPI,
    completeDeliverAPI,
    type IOrder,
} from '@/services/seller/seller.service';
import { App } from 'antd';

export const ActionComponent = ({ orderData }: { orderData: IOrder }) => {
    const { message, notification } = App.useApp();
    return (
        <>
            <div className="seller-order-detail__sidebar">
                <div className="seller-order-detail__summary">
                    <h2 className="seller-order-detail__summary-title">Tổng cộng</h2>
                    <div className="seller-order-detail__summary-row">
                        <span>Tạm tính ({orderData.order_items?.length || 0} sản phẩm)</span>
                        <span className="seller-order-detail__summary-price">
                            {formatCurrency(orderData.total)}
                        </span>
                    </div>
                    <div className="seller-order-detail__summary-row">
                        <span>Phí vận chuyển</span>
                        <span className="seller-order-detail__summary-price">
                            {formatCurrency(0)}
                        </span>
                    </div>
                    <hr className="seller-order-detail__separator" />
                    <div className="seller-order-detail__summary-row seller-order-detail__summary-row--final">
                        <span>Tổng thanh toán</span>
                        <span className="seller-order-detail__summary-price--final">
                            {formatCurrency(orderData.total)}
                        </span>
                    </div>
                </div>
                <div className="seller-order-detail__actions">
                    {orderData.status === 'RETURN_REQUEST' && (
                        <>
                            <button
                                className="btn-rebuy seller-order-detail__action-btn"
                                style={{ backgroundColor: '#1677ff', marginBottom: '12px' }}
                                onClick={async () => {
                                    try {
                                        // Handle multiple items in the order
                                        const returnPromises =
                                            orderData.order_items?.map(item =>
                                                acceptReturnRqAPI(orderData.id, item.id)
                                            ) || [];

                                        if (returnPromises.length === 0) {
                                            message.warning('Không có sản phẩm nào để trả hàng');
                                            return;
                                        }

                                        message.loading('Đang xử lý trả hàng...', 0);

                                        // Execute all return requests in parallel
                                        const results = await Promise.allSettled(returnPromises);

                                        // Check if all were successful
                                        const successful = results.filter(
                                            result => result.status === 'fulfilled'
                                        ).length;

                                        message.destroy();

                                        if (successful === returnPromises.length) {
                                            message.success(
                                                `Xác nhận trả hàng thành công cho ${successful} sản phẩm`
                                            );
                                        } else {
                                            message.warning(
                                                `Xác nhận trả hàng thành công cho ${successful}/${returnPromises.length} sản phẩm`
                                            );
                                        }

                                        // await delay(1000);
                                        // window.location.reload();
                                    } catch (error: any) {
                                        message.destroy();
                                        console.error('Return request error:', error);
                                        notification.error({
                                            message: 'Lỗi xác nhận trả hàng',
                                            description:
                                                error.response?.data?.error ||
                                                'Không thể xác nhận yêu cầu trả hàng',
                                        });
                                    }
                                }}
                            >
                                Xác nhận yêu cầu trả hàng
                            </button>
                        </>
                    )}
                    {orderData.status === 'PROCESSING' && (
                        <button
                            className="btn-rebuy seller-order-detail__action-btn"
                            style={{ backgroundColor: '#722ed1' }}
                            onClick={async () => {
                                try {
                                    await acceptDeliverAPI(orderData.id);
                                    message.success('Thành công');
                                    await delay(1000);

                                    window.location.reload();
                                } catch (error: any) {
                                    console.log(error);
                                    notification.error({
                                        message: 'Error',
                                        description: error.response.data.error,
                                    });
                                }
                            }}
                        >
                            Bắt đầu giao hàng
                        </button>
                    )}
                    {orderData.status === 'DELIVERING' && (
                        <button
                            className="btn-rebuy seller-order-detail__action-btn"
                            style={{ backgroundColor: '#13c2c2' }}
                            onClick={async () => {
                                try {
                                    await completeDeliverAPI(orderData.id);
                                    message.success('Thành công');
                                    await delay(1000);
                                    window.location.href = '/seller/myOrders';
                                } catch (error: any) {
                                    notification.error({
                                        message: 'Error',
                                        description: error.response.data.error,
                                    });
                                }
                            }}
                        >
                            Giao hàng thành công
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};
