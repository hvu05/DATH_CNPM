import default_order from '@/assets/seller/default_order.webp';
import { useNavigate } from 'react-router-dom';
import '@/styles/client/clientOrderList.scss';
import type { DataInOrder, OrdersInOrder, RequestReturnOrder } from '@/types/clients/client.order.types';
import { handleRebuy } from '@/helpers/client/rebuy';
import { message, Modal, Input } from 'antd';
import { useState } from 'react';
import { orderAPI } from '@/services/user/orders/user.order.api';

const { TextArea } = Input;

type Props = {
    orders: DataInOrder | null;
};

export const SuccessOrder = ({ orders }: Props) => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [returnReason, setReturnReason] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<OrdersInOrder | null>(null);

    // Filter orders that are in "SUCCEEDED" status
    const successOrders = orders?.orders?.filter(item => item?.status === 'COMPLETED');

    const handleEvaluate = (id: string) => {
        navigate(`/product/${id}`);
    };

    const handleReturn = (order: OrdersInOrder) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        if (!returnReason.trim()) {
            message.error('Vui lòng nhập lý do trả hàng!');
            return;
        }

        console.log('Đơn hàng ID:', selectedOrder?.id);
        console.log('Lý do trả hàng:', returnReason);
        const reason: RequestReturnOrder = {
            reason: returnReason
        }
        try{
            const res = await orderAPI.returnOrder(selectedOrder?.id || '', reason)

            message.success('Trả đơn hàng thành công, chờ nhân viên xác nhận')
        } catch (error){
            message.error('Trả đơn hàng thất bại, vui lòng thực hiện lại')
            console.log('Trả đơn thất bại' ,error)
        }

        setIsModalOpen(false);
        setReturnReason('');
        setSelectedOrder(null);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setReturnReason('');
        setSelectedOrder(null);
    };

    return (
        <>
            <div className="client-order__list">
                {successOrders && successOrders.length > 0 ? (successOrders?.map(order => (
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
                ))) : (<div>Chưa có đơn hàng</div>)}
            </div>

            <Modal
    title="Yêu cầu trả hàng"
    open={isModalOpen}
    onOk={handleOk}
    onCancel={handleCancel}
    okText="Xác nhận"
    cancelText="Hủy"
    width={500}
    okButtonProps={{ danger: true }}
>
    <div style={{ marginBottom: '10px' }}>
        <strong>Tổng tiền:</strong> {selectedOrder?.total?.toLocaleString()}đ
    </div>
    <div style={{ marginBottom: '10px' }}>
        <label htmlFor="returnReason">
            <strong>Lý do trả hàng: <span style={{ color: 'red' }}>*</span></strong>
        </label>
    </div>
    <TextArea
        id="returnReason"
        rows={4}
        placeholder="Vui lòng nhập lý do trả hàng (tối thiểu 10 ký tự)"
        value={returnReason}
        onChange={(e) => setReturnReason(e.target.value)}
        maxLength={500}
        showCount
    />
</Modal>
        </>
    );
};