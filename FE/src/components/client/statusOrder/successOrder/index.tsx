import default_order from '@/assets/seller/default_order.webp';
import { useNavigate } from 'react-router-dom';
import '@/styles/client/clientOrderList.scss';
import type { DataInOrder, OrdersInOrder } from '@/types/clients/client.order.types';
import { handleRebuy } from '@/helpers/client/rebuy';
import { message } from 'antd';

type Props = {
    orders: DataInOrder | null;
};
export const SuccessOrder = ({ orders }: Props) => {
    const navigate = useNavigate();

    // Filter orders that are in "SUCCEEDED" status
    const successOrders = orders?.orders?.filter(item => item?.status === 'COMPLETED');

    const handleEvaluate = (id: string) => {
        navigate(`/product/${id}`)
    };
    const handleReturn = (order: OrdersInOrder) => {
        console.log('Bạn đang bấm hủy đơn hàng có id: ', order.id)
    }
    return (
        <div className="client-order__list">
            {successOrders?.map(order => (
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
                        <div className="client-order__status--dflex">
                            <div className="btn-evaluate" onClick={() => handleEvaluate(order.order_items[0].id)}>
                                Đánh giá
                            </div>
                            <div className="btn-rebuy" onClick={() => handleRebuy(order, navigate)}>
                                Mua lại
                            </div>
                        </div>
                        <button className="client-order__return" onClick={() => handleReturn(order)}>
                            Trả hàng
                        </button>
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
