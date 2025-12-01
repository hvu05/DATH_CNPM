import default_order from '@/assets/seller/default_order.webp';
import { useNavigate } from 'react-router-dom';
import '@/styles/client/clientOrderList.scss';
import type { DataInOrder } from '@/types/clients/client.order.types';

type Props = {
    orders: DataInOrder | null;
};
export const ShippingOrder = ({ orders }: Props) => {
    const orderPending = orders?.orders?.filter(item => item?.status === 'DELIVERING');
    const navigate = useNavigate();
    // const navigate = useNavigate();
    return (
        <div className="client-order__list">
            {orderPending?.map(ord => (
                <div className="client-order__item" key={ord?.id}>
                    {ord?.order_items?.map(item => (
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
                            Giá: {ord?.total?.toLocaleString()}đ
                        </div>
                        <div className="btn-processing">Đang giao</div>
                        <button className="client-order__return">
                            Đơn hàng đã được giao đến bưu cục
                        </button>
                        <button
                            onClick={() =>
                                navigate(`/client/info/${ord?.id}`, { state: { order: ord } })
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
