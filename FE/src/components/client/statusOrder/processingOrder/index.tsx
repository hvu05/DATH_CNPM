import { useState } from 'react';
import default_order from '@/assets/seller/default_order.webp';
import { useNavigate } from 'react-router';
import '@/styles/client/clientOrderList.scss';
import type { DataInOrder } from '@/types/clients/client.order.types';
import { orderAPI } from '@/services/user/orders/user.order.api'; // Assuming this API exists for cancelation
import { message } from 'antd';

type Props = {
    orders: DataInOrder | null;
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ProcessingOrder = ({ orders, setRefresh }: Props) => {
    const navigate = useNavigate();

    // Filter orders that are in "PROCESSING" status
    const processingOrders = orders?.orders?.filter(item => item?.status === 'PROCESSING');

    // State for managing cancel modal
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<string>('');
    const [cancelReason, setCancelReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const openCancelModal = (orderId: string) => {
        setSelectedOrderId(orderId);
        setShowCancelModal(true);
        setCancelReason('');
    };

    const closeCancelModal = () => {
        setShowCancelModal(false);
        setSelectedOrderId('');
        setCancelReason('');
    };

    const submitCancelOrder = async () => {
        if (!cancelReason.trim()) {
            alert('Vui lòng nhập lý do hủy đơn hàng');
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await orderAPI.cancelOrder(selectedOrderId); // Assuming cancelOrder API exists

            if (res) {
                setRefresh(r => !r)
                message.success('Hủy đơn hàng thành công');
                // Trigger a refresh or update UI here (you can call a parent callback like `setRefresh`)
                closeCancelModal();
            }
        } catch (error) {
            console.error('Lỗi khi hủy đơn hàng:', error);
            alert('Có lỗi xảy ra, vui lòng thử lại!');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="client-order__list">
            {processingOrders?.map(order => (
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
                            Giá: {order?.total?.toLocaleString()}đ
                        </div>
                        <div className="btn-processing">Đơn hàng đang được xử lý</div>

                        {/* Cancel Order Button */}
                        <button
                            onClick={() => openCancelModal(order?.id)}
                            className="client-order__cancel"
                        >
                            Hủy đơn
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

            {/* Cancel Order Modal */}
            {showCancelModal && (
                <div className="cancel-modal-overlay" onClick={closeCancelModal}>
                    <div className="cancel-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="cancel-modal-header">
                            <h3>Hủy đơn hàng</h3>
                            <button className="cancel-modal-close" onClick={closeCancelModal}>
                                ✕
                            </button>
                        </div>

                        <div className="cancel-modal-body">
                            <label htmlFor="cancel-reason">
                                Vui lòng cho chúng tôi biết lý do hủy đơn hàng:
                            </label>
                            <textarea
                                id="cancel-reason"
                                className="cancel-reason-input"
                                value={cancelReason}
                                onChange={e => setCancelReason(e.target.value)}
                                placeholder="Nhập lý do hủy đơn hàng..."
                                rows={5}
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="cancel-modal-footer">
                            <button
                                className="btn-cancel-action"
                                onClick={closeCancelModal}
                                disabled={isSubmitting}
                            >
                                Quay lại
                            </button>
                            <button
                                className="btn-confirm-cancel"
                                onClick={submitCancelOrder}
                                disabled={isSubmitting || !cancelReason.trim()}
                            >
                                {isSubmitting ? 'Đang xử lý...' : 'Xác nhận hủy'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
