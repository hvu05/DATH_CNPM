import { Fragment } from 'react/jsx-runtime';
import defaultItem from '@/assets/client/default_order.webp';
import carIcon from '@/assets/client/car.svg';
import qrcodeIcon from '@/assets/client/qrcode.svg';
import './index.scss';
import { useState } from 'react';
import { ChangeAddressPage } from '@/components/client/ChangeAddress';
import { useLocation, useNavigate } from 'react-router-dom';
import { useClientProfile } from '@/hooks/client/useClientProfile';
import type { Address } from '@/types/clients/client.address.types';
import { orderAPI } from '@/services/user/orders/user.order.api';
import type {
    OrderItem,
    OrderItemInOrder,
    OrderRequest,
    OrdersInOrder,
    ProductVariant,
} from '@/types/clients/client.order.types';
import { message } from 'antd';
import type { CartItem } from '@/contexts/CartContext';

type OptionsPayment = 'COD' | 'VNPAY';
type ItemHandleOrder = {
    product_id: number;
    product_variant_id: number;
    quantity: number;
};
//?================================================================================================
//! LÚC GHÉP GIỎ HÀNG VÔ THÌ BẬT DÒNG (1) LÊN VÀ BỎ DÒNG (2). SAU ĐÓ BẬT CHỖ "TỔNG TIỀN" VÀ "CẦN THANH TOÁN" LÊN LÀ XONG
//?================================================================================================

export const OrderClient = () => {
    const [formChangeAddress, setFormChangeAddress] = useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation();
    const cartOrder: CartItem[] = location.state?.orderItems || null; //! (1)
    const totalOrder: number = location.state?.total || 0;

    // console.log('reere', location.state);
    const [statusPayment, setStatusPayment] = useState<OptionsPayment>('COD');

    const { data: profile, loading: loadingProfile } = useClientProfile();

    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

    //! (2)
    //const cartOrder: OrderItem[] = [
    //     {
    //         id: 1,
    //         price_per_item: 25000000,
    //         quantity: 2,
    //         product_variant: {
    //             id: 1,
    //             product_id: 101,
    //             color: 'Đen',
    //             storage: '128GB',
    //             name: 'iPhone 15 Pro',
    //             price: 25000000,
    //         },
    //     },
    //     {
    //         id: 2,
    //         price_per_item: 28000000,
    //         quantity: 1,
    //         product_variant: {
    //             id: 2,
    //             product_id: 101,
    //             color: 'Trắng',
    //             storage: '256GB',
    //             name: 'iPhone 15 Pro',
    //             price: 28000000,
    //         },
    //     },
    //     {
    //         id: 3,
    //         price_per_item: 22000000,
    //         quantity: 3,
    //         product_variant: {
    //             id: 3,
    //             product_id: 102,
    //             color: 'Xanh',
    //             storage: '512GB',
    //             name: 'Samsung Galaxy S24',
    //             price: 22000000,
    //         },
    //     },
    //     {
    //         id: 4,
    //         price_per_item: 5000000,
    //         quantity: 1,
    //         product_variant: {
    //             id: 4,
    //             product_id: 103,
    //             color: 'Đỏ',
    //             storage: '64GB',
    //             name: 'Xiaomi Redmi Note 13',
    //             price: 5000000,
    //         },
    //     },
    // ];

    const HandleOrder = async () => {
        let order: OrderRequest = {
            province: selectedAddress?.province || 'Chưa chọn',
            ward: selectedAddress?.ward || 'Chưa chọn',
            detail: selectedAddress?.detail || 'Chưa chọn',
            items: [],
            method: statusPayment,
        };
        let items: Array<ItemHandleOrder> = [];
        cartOrder.forEach(item => {
            const itemOrder: ItemHandleOrder = {
                product_id: item.productId,
                product_variant_id: item.variantId,
                quantity: item.quantity,
            };
            items.push(itemOrder);
        });
        order.items = items;
        const res = await orderAPI.createOrder(order);
        if (res) {
            if (!selectedAddress) {
                message.warning('Vui lòng chọn địa chỉ');
                return;
            }

            if (statusPayment === 'VNPAY') {
                navigate('/client/order/payment', { state: { qrUrl: res.data?.url } });
            } else if (statusPayment === 'COD') {
                navigate('/client/order/success');
            }
        }
    };

    if (loadingProfile) return <p>Loading...</p>;
    if (!cartOrder)
        return <h1 style={{ fontSize: '30px' }}>Vui lòng chọn sản phẩm trước khi vào trang này</h1>;
    return (
        <div className="client-order-detail">
            <div className="client-order-detail__main">
                {/* Products Card */}
                <div className="client-order-detail__card">
                    <h2 className="client-order-detail__card-title">
                        Sản phẩm trong đơn ({cartOrder?.length || 0})
                    </h2>
                    <div className="client-order-detail__product-list">
                        {cartOrder.map((item, index) => (
                            <Fragment key={index}>
                                <div className="client-order-detail__product-item">
                                    <div className="client-order-detail__product-info">
                                        <div className="client-order-detail__product-img-container">
                                            <img src={item.imageUrl || defaultItem} alt="item" />
                                        </div>
                                        <div className="client-order-detail__product-details">
                                            <h3 className="client-order-detail__product-name">
                                                {item?.name}
                                            </h3>
                                            <div className="client-order-detail__product-attrs">
                                                <span>Số lượng: {item?.quantity}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="client-order-detail__product-price">
                                        {item.price.toLocaleString()} VNĐ
                                    </div>
                                </div>
                                {<hr className="client-order-detail__separator" />}
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
                                    {selectedAddress?.receive_name ||
                                        profile?.full_name ||
                                        'Chưa xác định'}
                                </span>
                            </p>
                            <p>
                                <span className="client-order-detail__info-label">
                                    Số điện thoại:
                                </span>{' '}
                                <span className="client-order-detail__info-value">
                                    {selectedAddress?.phone || profile?.phone || '0854747707'}
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
                        <span className="client-order-detail__summary-price">
                            {totalOrder.toLocaleString()} VNĐ
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
                            {totalOrder.toLocaleString()} VNĐ
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
