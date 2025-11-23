import { Fragment } from 'react/jsx-runtime';
import defaultItem from '@/assets/client/default_order.webp';
import carIcon from '@/assets/client/car.svg';
import qrcodeIcon from '@/assets/client/qrcode.svg';
import './index.scss';
import { useState } from 'react';
import { ChangeAddressPage } from '@/components/client/ChangeAddress';
import { useNavigate } from 'react-router';
import { useClientProfile } from '@/hooks/client/useClientProfile';
import type { Address } from '@/types/clients/client.address.types';
import { orderAPI } from '@/services/user/orders/user.order.api';
import type { OrderRequest } from '@/types/clients/client.order.types';
import { message } from 'antd';

type OptionsPayment = 'COD' | 'VNPAY';

export const OrderClient = () => {
    const [formChangeAddress, setFormChangeAddress] = useState<boolean>(false);
    const navigate = useNavigate();

    const [statusPayment, setStatusPayment] = useState<OptionsPayment>('COD');

    const { data: profile, loading: loadingProfile } = useClientProfile();

    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

    const order_fake: OrderRequest = {
        province: selectedAddress?.province || 'Chưa chọn',
        ward: selectedAddress?.ward || 'Chưa chọn',
        detail: selectedAddress?.detail || 'Chưa chọn',
        items: [
            {
                product_id: 1,
                product_variant_id: 2,
                quantity: 1,
            },
        ],
        method: statusPayment,
    };
    const HandleOrder = async () => {
        const res = await orderAPI.createOrder(order_fake);
        if (res) {
            if (!selectedAddress) {
                message.warning('Vui lòng chọn địa chỉ');
                return;
            }

            if (statusPayment === 'VNPAY') {
                navigate('/client/order/payment', { state: { qrUrl: res.data?.url } });
            } else if(statusPayment === 'COD') {
                navigate('/client/order/success');
            }
        }
    };

    if (loadingProfile) return <p>Loading...</p>;
    return (
        <div className="client-order-detail">
            <div className="client-order-detail__main">
                {/* Products Card */}
                <div className="client-order-detail__card">
                    <h2 className="client-order-detail__card-title">Sản phẩm trong đơn (2)</h2>
                    <div className="client-order-detail__product-list">
                        {new Array(2).fill(0).map((_, index) => (
                            <Fragment key={index}>
                                <div className="client-order-detail__product-item">
                                    <div className="client-order-detail__product-info">
                                        <div className="client-order-detail__product-img-container">
                                            <img src={defaultItem} alt="item" />
                                        </div>
                                        <div className="client-order-detail__product-details">
                                            <h3 className="client-order-detail__product-name">
                                                Tên sản phẩm
                                            </h3>
                                            <div className="client-order-detail__product-attrs">
                                                <span>Color: black</span>
                                                <span>Quantity: 10</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="client-order-detail__product-price">
                                        100.000VND
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
                                    {selectedAddress?.detail} - {selectedAddress?.ward} -{' '}
                                    {selectedAddress?.province}
                                </div>
                            </div>
                            <button
                                className="client-order-detail__change-btn"
                                onClick={() => setFormChangeAddress(true)}
                            >
                                Thay đổi
                            </button>
                        </div>
                    </div>
                </div>

                {/* Payment Method Card */}
                <div className="client-order-detail__card">
                    <h2 className="client-order-detail__card-title">Phương thức thanh toán</h2>
                    <div className="client-order-detail__payment-options">
                        <div
                            className="client-order-detail__payment-option"
                            onClick={() => setStatusPayment('COD')}
                        >
                            <input type="radio" name="payment" id="payment-cash" defaultChecked />
                            <label htmlFor="payment-cash">
                                <img src={carIcon} alt="Cash payment" />
                                <span>Thanh toán khi nhận hàng</span>
                            </label>
                        </div>
                        <div
                            className="client-order-detail__payment-option"
                            onClick={() => setStatusPayment('VNPAY')}
                        >
                            <input type="radio" name="payment" id="payment-qrcode" />
                            <label htmlFor="payment-qrcode">
                                <img src={qrcodeIcon} alt="QR Code payment" />
                                <span>Thanh toán bằng mã QR</span>
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
                        <span className="client-order-detail__summary-price">220.000VND</span>
                    </div>
                    <div className="client-order-detail__summary-row">
                        <span>Tổng khuyến mãi</span>
                        <span className="client-order-detail__summary-price">-20.000VND</span>
                    </div>
                    <hr className="client-order-detail__separator" />
                    <div className="client-order-detail__summary-row client-order-detail__summary-row--final">
                        <span>Cần thanh toán</span>
                        <span className="client-order-detail__summary-price--final">
                            200.000VND
                        </span>
                    </div>
                </div>
                <div className="btn-rebuy client-order-detail__checkout" onClick={HandleOrder}>
                    Đặt hàng
                </div>
            </div>
            {formChangeAddress && (
                <ChangeAddressPage
                    setFormChangeAddress={setFormChangeAddress}
                    setSelectedAddress={setSelectedAddress}
                />
            )}
        </div>
    );
};
