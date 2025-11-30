import default_order from '@/assets/seller/default_order.webp';
// import { useNavigate } from 'react-router-dom';
import '@/styles/client/clientOrderList.scss';
import type { DataInOrder, StatusOrder } from '@/types/clients/client.order.types';
import { useNavigate } from 'react-router-dom';

type Props = {
    orders: DataInOrder | null; // Định nghĩa kiểu dữ liệu cho props.orders
};

export const AllOrders = ({ orders }: Props) => {
    //   const navigate = useNavigate();

    const getStatusButton = (status: StatusOrder) => {
        switch (status) {
            case 'PENDING':
                return <div className="btn-cancel">Đang chờ thanh toán</div>;
            case 'DELIVERING':
                return <div className="btn-cancel">Đang giao</div>;
            case 'PROCESSING':
                return <div className="btn-cancel">Đang xử lý</div>;
            case 'COMPLETED':
                return <div className="btn-cancel">Thành công</div>;
            case 'RETURNED':
                return <div className="btn-cancel">Đơn hàng đã hoàn trả</div>;
            case 'CANCELLED':
                return <div className="btn-cancel">Đã hủy</div>;
            case 'RETURN_REQUEST':
                return <div className="btn-cancel">Đơn hàng hoàn trả đang chờ xác nhận</div>;

            default:
                return <div className="btn-default">Chưa xác định</div>;
        }
    };

    const navigate = useNavigate();
    return (
        <div className="client-order__list">
            {orders?.orders.map(order => (
                <div className="client-order__item" key={order?.id}>
                    {order?.order_items?.map(item => (
                        <div className="client-order__product-info" key={item?.id}>
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
                    ))}

                    <div className="client-order__price-status">
                        <div className="client-order__price">
                            Tổng giá: {order?.total?.toLocaleString()}đ
                        </div>
                        {getStatusButton(order?.status)}

                        <button
                            onClick={() =>
                                navigate(`/client/info/${order?.id}`, { state: { order: order } })
                            }
                            className="client-order__detail-link"
                        >
                            Chi tiết đơn hàng
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};
