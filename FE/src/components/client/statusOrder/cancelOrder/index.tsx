import default_order from '@/assets/seller/default_order.webp';
import { useNavigate } from 'react-router-dom';
import '@/styles/client/clientOrderList.scss';

export const CancelOrders = ({ orders }) => {
    const navigate = useNavigate();

    // Filter orders that are in "CANCELLED" status
    const cancelledOrders = orders?.data?.orders?.filter(item => item?.status === 'CANCELLED');

    return (
        <div className="client-order__list">
            {cancelledOrders?.map(order =>
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
                            <div className="btn-rebuy">Mua lại</div>

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
