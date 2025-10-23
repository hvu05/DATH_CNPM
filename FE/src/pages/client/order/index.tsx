import {Fragment} from "react/jsx-runtime";
import defaultItem from "@/assets/client/default_order.webp";
import carIcon from "@/assets/client/car.svg";
import qrcodeIcon from "@/assets/client/qrcode.svg";
import './index.scss'
import {useState} from "react";
import {ChangeAddressPage} from "@/components/client/ChangeAddress";
import {useNavigate} from "react-router";

type OptionsFillter = 'cod' | 'card'

export const OrderClient = () => {
    const [formChangeAddress, setFormChangeAddress] = useState<boolean>(false);
    const [statePayment, setStatePayment] = useState<OptionsFillter>('cod');
    const navigate = useNavigate()

    const HandleOrder = () => {
        if(statePayment === 'card'){navigate('/client/order/payment')}
        else navigate('/client/order/success')
    }
    return (
        <div className="client-order-detail">
            <div className="client-order-detail__main">
                {/* Products Card */}
                <div className='client-order-detail__card'>
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
                                            <h3 className='client-order-detail__product-name'>Tên sản phẩm</h3>
                                            <div className="client-order-detail__product-attrs">
                                                <span>Color: black</span>
                                                <span>Quantity: 10</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="client-order-detail__product-price">100.000VND</div>
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
                            <p><span className="client-order-detail__info-label">Họ và tên:</span> <span className="client-order-detail__info-value">Lê Nguyễn Văn Sĩ</span></p>
                            <p><span className="client-order-detail__info-label">Số điện thoại:</span> <span className="client-order-detail__info-value">01234567890</span></p>
                        </div>
                        <div className="client-order-detail__info-group client-order-detail__info-group--address">
                            <div>
                                <div className="client-order-detail__info-label">Địa chỉ</div>
                                <div className="client-order-detail__info-value">Số 123 Đường ABC, Khu phố A, Tỉnh ABC</div>
                            </div>
                            <button className='client-order-detail__change-btn' onClick={() => setFormChangeAddress(true)}>Thay đổi</button>
                        </div>
                    </div>
                </div>

                {/* Payment Method Card */}
                <div className="client-order-detail__card">
                    <h2 className="client-order-detail__card-title">Phương thức thanh toán</h2>
                    <div className="client-order-detail__payment-options">
                        <div className="client-order-detail__payment-option"
                             onClick={() => setStatePayment('cod')}>
                            <input type="radio" name='payment' id='payment-cash' defaultChecked />
                            <label htmlFor='payment-cash'>
                                <img src={carIcon} alt="Cash payment" />
                                <span>Thanh toán khi nhận hàng</span>
                            </label>
                        </div>
                        <div className="client-order-detail__payment-option"
                             onClick={() => setStatePayment('card')}>
                            <input type="radio" name='payment' id='payment-qrcode' />
                            <label htmlFor='payment-qrcode'>
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
                        <span className="client-order-detail__summary-price--final">200.000VND</span>
                    </div>
                </div>
                <div className='btn-rebuy client-order-detail__checkout' onClick={HandleOrder}>Đặt hàng</div>

            </div>
            {formChangeAddress && (<ChangeAddressPage setFormChangeAddress={setFormChangeAddress} />)}
        </div>
    )
}