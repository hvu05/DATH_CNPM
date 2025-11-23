import { useLocation, useNavigate } from 'react-router';
import './detail.scss';
import defaultItem from '@/assets/seller/default_order.webp';
import { Fragment } from 'react/jsx-runtime';
import { Button, Typography, Skeleton, App } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import type { ICustomer, IOrder, OrderStatus } from '@/services/seller/seller.service';
import {
    acceptDeliverAPI,
    acceptReturnRqAPI,
    completeDeliverAPI,
    getUserById,
} from '@/services/seller/seller.service';
import { useEffect, useState } from 'react';

const { Title } = Typography;

export const DetailPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const orderData = location.state?.order as IOrder;
    const [customerInfo, setCustomerInfo] = useState<ICustomer | null>(null);
    const [loadingCustomer, setLoadingCustomer] = useState(false);
    const { message, notification } = App.useApp();

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    // Redirect back if no order data is provided
    useEffect(() => {
        if (!orderData) {
            message.error('Không tìm thấy thông tin đơn hàng');
            navigate('/seller/myOrders');
        }
    }, [orderData, navigate]);

    // Fetch customer information when orderData changes
    useEffect(() => {
        const fetchCustomerInfo = async () => {
            if (!orderData?.user_id) return;

            setLoadingCustomer(true);
            try {
                const result = await getUserById(orderData.user_id);
                if (result.data) {
                    setCustomerInfo(result.data);
                }
            } catch (error) {
                console.error('Failed to fetch customer info:', error);
                message.warning('Không thể tải thông tin khách hàng');
            } finally {
                setLoadingCustomer(false);
            }
        };

        fetchCustomerInfo();
    }, [orderData?.user_id]);

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    // Get status color and text
    const getStatusColor = (status: OrderStatus) => {
        const colors: Record<OrderStatus, string> = {
            PENDING: 'orange',
            PROCESSING: 'orange',
            DELIVERING: 'purple',
            COMPLETED: 'green',
            CANCELLED: 'red',
            RETURNED: 'blue',
            REFUNDED: 'red',
            RETURN_REQUEST: 'orange',
        };
        return colors[status] || 'default';
    };

    const getStatusText = (status: OrderStatus) => {
        const texts: Record<OrderStatus, string> = {
            PENDING: 'Chờ xác nhận',
            PROCESSING: 'Đang xử lý',
            DELIVERING: 'Đang giao',
            COMPLETED: 'Hoàn thành',
            CANCELLED: 'Đã hủy',
            RETURNED: 'Đã trả hàng',
            REFUNDED: 'Đã hoàn tiền',
            RETURN_REQUEST: 'Yêu cầu trả hàng',
        };
        return texts[status] || status;
    };

    if (!orderData) {
        return (
            <div style={{ padding: '24px', textAlign: 'center' }}>
                <Title level={3}>Đang tải...</Title>
            </div>
        );
    }

    return (
        <div className="seller-order-detail">
            <div style={{ marginBottom: '24px' }}>
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/seller/myOrders')}
                    style={{ marginBottom: '16px' }}
                >
                    Quay lại danh sách đơn hàng
                </Button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Title level={2} style={{ margin: 0 }}>
                        Chi tiết đơn hàng #{orderData.id}
                    </Title>
                    <span
                        style={{
                            padding: '4px 12px',
                            borderRadius: '6px',
                            background: getStatusColor(orderData.status) + '20',
                            color: getStatusColor(orderData.status),
                            fontWeight: 'bold',
                        }}
                    >
                        {getStatusText(orderData.status)}
                    </span>
                </div>
            </div>

            <div className="seller-order-detail__content">
                <div className="seller-order-detail__main">
                    {/* Products Card */}
                    <div className="seller-order-detail__card">
                        <h2 className="seller-order-detail__card-title">
                            Sản phẩm trong đơn ({orderData.order_items?.length || 0})
                        </h2>
                        <div className="seller-order-detail__product-list">
                            {orderData.order_items?.map((item, index) => (
                                <Fragment key={item.id}>
                                    <div className="seller-order-detail__product-item">
                                        <div className="seller-order-detail__product-info">
                                            <div className="seller-order-detail__product-img-container">
                                                <img
                                                    src={
                                                        item.product_variant?.thumbnail ||
                                                        defaultItem
                                                    }
                                                    alt={item.product_variant?.name || 'Sản phẩm'}
                                                />
                                            </div>
                                            <div className="seller-order-detail__product-details">
                                                <h3 className="seller-order-detail__product-name">
                                                    {item.product_variant?.name || 'Sản phẩm'}
                                                </h3>
                                                <div className="seller-order-detail__product-attrs">
                                                    <span>
                                                        Màu sắc:{' '}
                                                        {item.product_variant?.color || 'N/A'}
                                                    </span>
                                                    <span>
                                                        Dung lượng:{' '}
                                                        {item.product_variant?.storage || 'N/A'}
                                                    </span>
                                                    <span>Số lượng: {item.quantity}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="seller-order-detail__product-price">
                                            {formatCurrency(
                                                parseFloat(item.price_per_item) * item.quantity
                                            )}
                                        </div>
                                    </div>
                                    {index < (orderData.order_items?.length || 0) - 1 && (
                                        <hr className="seller-order-detail__separator" />
                                    )}
                                </Fragment>
                            ))}
                        </div>
                    </div>

                    {/* Customer Info Card */}
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
                                            <span className="seller-order-detail__info-label">
                                                Email:
                                            </span>{' '}
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

                    {/* Order Info Card */}
                    <div className="seller-order-detail__card">
                        <h2 className="seller-order-detail__card-title">Thông tin đơn hàng</h2>
                        <div className="seller-order-detail__customer-info">
                            <div className="seller-order-detail__info-group">
                                <p>
                                    <span className="seller-order-detail__info-label">
                                        Mã đơn hàng:
                                    </span>{' '}
                                    <span className="seller-order-detail__info-value">
                                        #{orderData.id}
                                    </span>
                                </p>
                                <p>
                                    <span className="seller-order-detail__info-label">
                                        Ngày đặt:
                                    </span>{' '}
                                    <span className="seller-order-detail__info-value">
                                        {new Date(orderData.create_at).toLocaleString('vi-VN')}
                                    </span>
                                </p>
                                {orderData.deliver_at && (
                                    <p>
                                        <span className="seller-order-detail__info-label">
                                            Ngày giao:
                                        </span>{' '}
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

                    {/* Payment Info Card */}
                    <div className="seller-order-detail__card">
                        <h2 className="seller-order-detail__card-title">Thông tin thanh toán</h2>
                        <div className="seller-order-detail__payment-info">
                            <div className="seller-order-detail__info-group">
                                <p>
                                    <span className="seller-order-detail__info-label">
                                        Phương thức:
                                    </span>{' '}
                                    <span className="seller-order-detail__info-value">
                                        {orderData.payment?.method || 'N/A'}
                                    </span>
                                </p>
                                <p>
                                    <span className="seller-order-detail__info-label">
                                        Trạng thái:
                                    </span>{' '}
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
                </div>

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
                                                message.warning(
                                                    'Không có sản phẩm nào để trả hàng'
                                                );
                                                return;
                                            }

                                            message.loading('Đang xử lý trả hàng...', 0);

                                            // Execute all return requests in parallel
                                            const results =
                                                await Promise.allSettled(returnPromises);

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
            </div>
        </div>
    );
};
