import default_order from '@/assets/seller/default_order.webp';
import { useNavigate } from 'react-router';
import '@/styles/client/clientOrderList.scss';

export const ProcessingOrder = ({ orders }) => {
    const navigate = useNavigate();

    // Filter orders that are in "PROCESSING" status
    const processingOrders = orders?.data?.orders?.filter(item => item?.status === 'PROCESSING');

    return (
        <div className="client-order__list">
            {processingOrders?.map(order => 
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
                            <div className="btn-processing">Đang xử lý</div>
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
