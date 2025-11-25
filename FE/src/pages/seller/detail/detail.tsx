import { useLocation, useNavigate } from 'react-router';
import './detail.scss';
import { Button, Typography, App } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import type { ICustomer, IOrder, IOrderReturnRequest } from '@/services/seller/seller.service';
import { getInforOrderReq, getUserById } from '@/services/seller/seller.service';
import { getStatusColor, getStatusText } from '@/helpers/seller/helper';
import { useEffect, useState } from 'react';
import { ActionComponent } from '@/components/seller/detailOrder/action';
import { ProductCard } from '@/components/seller/detailOrder/product.card';
import { CustomerCard } from '@/components/seller/detailOrder/customer.card';
import { OrderInfoCard } from '@/components/seller/detailOrder/order.card';
import { PaymentInfoCard } from '@/components/seller/detailOrder/payment.card';
import { ReturnCard } from '@/components/seller/detailOrder/return.card';

const { Title } = Typography;

export const DetailPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const orderData = location.state?.order as IOrder;
    const [customerInfo, setCustomerInfo] = useState<ICustomer | null>(null);
    const [loadingCustomer, setLoadingCustomer] = useState(false);
    const [returnData, setReturnData] = useState<IOrderReturnRequest | null>(null);
    const [loadingReturn, setLoadingReturn] = useState(false);
    const { message } = App.useApp();

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

    // fetch if order_status = 'RETURN_REQUEST' | "RETURNED"
    useEffect(() => {
        if (orderData.status == 'REFUNDED' || orderData.status == 'RETURN_REQUEST') {
            const loadReturnReq = async () => {
                if (!orderData.order_items || orderData.order_items.length === 0) return;

                setLoadingReturn(true);
                try {
                    const result = await getInforOrderReq(orderData.id, orderData.order_items[0].id);
                    if (result.success && result.data) {
                        setReturnData(result.data);
                    }
                } catch (error) {
                    console.error('Failed to fetch return info:', error);
                    message.warning('Không thể tải thông tin trả hàng');
                } finally {
                    setLoadingReturn(false);
                }
            };
            loadReturnReq();
        }
    }, [orderData?.status, orderData?.id, orderData?.order_items, message]);

    if (!orderData) {
        return (
            <div className="p-6 text-center">
                <Title level={3}>Đang tải...</Title>
            </div>
        );
    }
    return (
        <div className="seller-order-detail">
            <div className="mb-6">
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/seller/myOrders')}
                    className="mb-4"
                >
                    Quay lại danh sách đơn hàng
                </Button>
                <div className="flex, items-center, gap-3">
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
                    <ProductCard orderData={orderData} />
                    {/* Customer Info Card */}
                    <CustomerCard
                        customerInfo={customerInfo}
                        orderData={orderData}
                        loadingCustomer={loadingCustomer}
                    />
                    {/* Return Info Card - Only show for orders with return status */}
                    {(orderData.status === 'REFUNDED' || orderData.status === 'RETURN_REQUEST') && (
                        <ReturnCard returnData={returnData} loading={loadingReturn} />
                    )}
                    {/* Order Info Card */}
                    <OrderInfoCard orderData={orderData} />
                    {/* Payment Info Card */}
                    <PaymentInfoCard orderData={orderData} />
                </div>
                {/* right side  */}
                <ActionComponent orderData={orderData} />
            </div>
        </div>
    );
};
