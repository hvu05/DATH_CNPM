import { Fragment } from 'react/jsx-runtime';
import defaultItem from '@/assets/client/default_order.webp';
import carIcon from '@/assets/client/car.svg';

import { useLocation } from 'react-router-dom';
import { useClientProfile } from '@/hooks/client/useClientProfile';

import type { OrdersInOrder } from '@/types/clients/client.order.types';


export const ReOrderClient = () => {

    const location = useLocation();
    const order: OrdersInOrder = location.state.order || '';

    const { data: profile, loading: loadingProfile } = useClientProfile();

    if (loadingProfile) return <p>Loading...</p>;
    return (
        <div className="client-order-detail">
            <div className="client-order-detail__main">
                {/* Products Card */}
                <div className="client-order-detail__card">
                    <h2 className="client-order-detail__card-title">
                        Sản phẩm trong đơn ({order.order_items.length})
                    </h2>
                    <div className="client-order-detail__product-list">
                        {order.order_items.map((ord, index) => (
                            <Fragment key={ord.id}>
                                <div className="client-order-detail__product-item">
                                    <div className="client-order-detail__product-info">
                                        <div className="client-order-detail__product-img-container">
                                            <img src={ord.product_variant.thumbnail || defaultItem} alt="item" />
                                        </div>
                                        <div className="client-order-detail__product-details">
                                            <h3 className="client-order-detail__product-name">
                                                {ord.product_variant.name}
                                            </h3>
                                            <div className="client-order-detail__product-attrs">
                                                <span>{ord.product_variant.color}</span>
                                                <span>Quantity: {ord.quantity}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="client-order-detail__product-price">
                                        {ord.price_per_item.toLocaleString()} VND
                                    </div>
                                </div>
                                {index < 1 && <hr className="client-order-detail__separator" />}
                            </Fragment>
                        ))}
                    </div>
                </div>

                {/* Customer Info Card */}
                <div className="client-order-detail__card">
                    <h2 className="client-order-detail__card-title">Thông tin khách hàng</h2>
                    <div className="client-order-detail__customer-info">
                        <div className="client-order-detail__info-group">
                            <p>
                                <span className="client-order-detail__info-label">Họ và tên:</span>{' '}
                                <span className="client-order-detail__info-value">
                                    {profile?.full_name || 'Chưa xác định'}
                                </span>
                            </p>
                            <p>
                                <span className="client-order-detail__info-label">
                                    Số điện thoại:
                                </span>{' '}
                                <span className="client-order-detail__info-value">
                                    {profile?.phone || '0854747707'}
                                </span>
                            </p>
                        </div>
                        <div className="client-order-detail__info-group client-order-detail__info-group--address">
                            <div>
                                <div className="client-order-detail__info-label">Địa chỉ</div>
                                <div className="client-order-detail__info-value">
                                    {order.address.detail} - {order.address.ward} -{' '}
                                    {order.address.province}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Method Card */}
                <div className="client-order-detail__card">
                    <h2 className="client-order-detail__card-title">Phương thức thanh toán</h2>
                    <div className="client-order-detail__payment-options">
                        <div
                            className="client-order-detail__payment-option"
                        >
                            <input type="radio" name="payment" id="payment-cash" defaultChecked />
                            <label htmlFor="payment-cash">
                                <img src={carIcon} alt="Cash payment" />
                                <span>{order.payment.method}</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="client-order-detail__sidebar">
                <div className="client-order-detail__summary">
                    <h2 className="client-order-detail__summary-title">Thông tin đơn hàng</h2>
                    <div className="client-order-detail__summary-row">
                        <span>Tổng tiền</span>
                        <span className="client-order-detail__summary-price">
                            {order.total.toLocaleString()} VND
                        </span>
                    </div>
                    <div className="client-order-detail__summary-row">
                        <span>Tổng khuyến mãi</span>
                        <span className="client-order-detail__summary-price">0 VND</span>
                    </div>
                    <hr className="client-order-detail__separator" />
                    <div className="client-order-detail__summary-row client-order-detail__summary-row--final">
                        <span>Cần thanh toán</span>
                        <span className="client-order-detail__summary-price--final">
                            {order.total.toLocaleString()} VND
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
