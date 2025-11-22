import default_order from '@/assets/seller/default_order.webp';
import { useNavigate } from 'react-router-dom';
import '@/styles/client/clientOrderList.scss';

export const AllOrders = ({ orders }) => {
    const navigate = useNavigate();

    const getStatusButton = status => {
        switch (status) {
            case 'PENDING':
                return <div className="btn-pending-pay">Đang chờ thanh toán</div>;
            case 'DELIVERING':
                return <div className="btn-shipping">Đang giao</div>;
            case 'PROCESSING':
                return <div className="btn-processing">Đang xử lý</div>;
            case 'COMPLETED':
                return <div className="btn-success">Thành công</div>;
            case 'RETURNED':
                return <div className="btn-return">Trả hàng</div>;
            case 'CANCELLED':
                return <div className="btn-cancel">Hủy hàng</div>;
            default:
                return <div className="btn-default">Chưa xác định</div>;
        }
    };

    return (
        <div className="client-order__list">
            {orders?.data?.orders?.map(order =>
                order?.order_items?.map(item => (
                    <div className="client-order__item" key={item?.id}>
                        <div className="client-order__product-info">
                            <div className="client-order__img-container">
                                <img
                                    className="client-order__img"
                                    src={default_order}
                                    alt="order_img"
                                />
                            </div>
                            <div className="client-order__details">
                                <div className="client-order__name">
                                    {item?.product_variant?.name}
                                </div>
                                <div className="client-order__category">
                                    {item?.product_variant?.color}
                                </div>
                                <div className="client-order__quantity">
                                    Số lượng: {item?.quantity}
                                </div>
                            </div>
                        </div>
                        <div className="client-order__price-status">
                            <div className="client-order__price">
                                Giá: {item?.product_variant?.price.toLocaleString()}đ
                            </div>
                            {getStatusButton(order?.status)}

                            {/* <button
                                onClick={() => navigate(`/client/order/${order?.id}`)}
                                className="client-order__detail-link"
                            >
                                Chi tiết đơn hàng
                            </button> */}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};
