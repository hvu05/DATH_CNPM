import default_order from '@/assets/seller/default_order.webp';
import { useNavigate } from 'react-router-dom';
import '@/styles/client/clientOrderList.scss';
import type { DataInOrder, OrdersInOrder } from '@/types/clients/client.order.types';
import type { CartItem } from '@/contexts/CartContext';
import { handleRebuy } from '@/helpers/client/rebuy';

type Props = {
    orders: DataInOrder | null;
};
export const CancelOrders = ({ orders }: Props) => {
    const navigate = useNavigate();

    // Filter orders that are in "CANCELLED" status
    const cancelledOrders = orders?.orders?.filter(item => item?.status === 'CANCELLED');


    return (
        <div className="client-order__list">
            {cancelledOrders && cancelledOrders.length > 0 ? (cancelledOrders?.map(order => (
                <div className="client-order__item" key={order?.id}>
                    {order?.order_items?.map(item => (
                        <div className="client-order__product-info" key={item?.id}>
                            <div className="client-order__img-container">
                                <img
                                    className="client-order__img"
                                    src={item.product_variant.thumbnail || default_order}
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
                            Giá: {order?.total?.toLocaleString()}đ
                        </div>
                        <div className="btn-rebuy" onClick={() => handleRebuy(order, navigate)}>
                            Mua lại
                        </div>

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
            ))) : (<div>Chưa có đơn hàng</div>)}
        </div>
    );
};
