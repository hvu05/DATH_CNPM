import default_order from '@/assets/seller/default_order.webp';
import { useNavigate } from 'react-router-dom';
import '@/styles/client/clientOrderList.scss';

//! file này code lỏ vì định nghĩa datatype quá dài nên quyết định bỏ
export const PendingPay = ({ orders }) => {
    const orderPending = orders?.data?.orders?.filter(item => item?.status === 'PENDING');

    console.log('hihi', orderPending);
    const navigate = useNavigate();
    return (
        <div className="client-order__list">
            {orderPending?.map(ord =>
                ord?.order_items?.map(item => (
                    <div className="client-order__item">
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
                                Giá: {item?.price_per_item.toLocaleString()} VNĐ
                            </div>
                            <div className="btn-rebuy">Thanh toán ngay</div>
                            {/* <button
                                onClick={() => navigate('/client/order/1')}
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
