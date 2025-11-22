import { useParams } from 'react-router-dom';
import './detail.scss';
import defaultItem from '@/assets/seller/default_order.webp';
import { Fragment } from 'react/jsx-runtime';
import carIcon from '@/assets/seller/car.svg';
import qrcodeIcon from '@/assets/seller/qrcode.svg';

export const DetailPage = () => {
    const { id } = useParams();
    return (
        <div className="seller-order-detail">
            <div className="seller-order-detail__main">
                {/* Products Card */}
                <div className="seller-order-detail__card">
                    <h2 className="seller-order-detail__card-title">Sản phẩm trong đơn (2)</h2>
                    <div className="seller-order-detail__product-list">
                        {new Array(2).fill(0).map((_, index) => (
                            <Fragment key={index}>
                                <div className="seller-order-detail__product-item">
                                    <div className="seller-order-detail__product-info">
                                        <div className="seller-order-detail__product-img-container">
                                            <img src={defaultItem} alt="item" />
                                        </div>
                                        <div className="seller-order-detail__product-details">
                                            <h3 className="seller-order-detail__product-name">
                                                Tên sản phẩm
                                            </h3>
                                            <div className="seller-order-detail__product-attrs">
                                                <span>Color: black</span>
                                                <span>Quantity: 10</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="seller-order-detail__product-price">
                                        100.000VND
                                    </div>
                                </div>
                                {index < 1 && <hr className="seller-order-detail__separator" />}
                            </Fragment>
                        ))}
                    </div>
                </div>

                {/* Customer Info Card */}
                <div className="seller-order-detail__card">
                    <h2 className="seller-order-detail__card-title">Thông tin khách hàng</h2>
                    <div className="seller-order-detail__customer-info">
                        <div className="seller-order-detail__info-group">
                            <p>
                                <span className="seller-order-detail__info-label">Họ và tên:</span>{' '}
                                <span className="seller-order-detail__info-value">
                                    Lê Nguyễn Văn Sĩ
                                </span>
                            </p>
                            <p>
                                <span className="seller-order-detail__info-label">
                                    Số điện thoại:
                                </span>{' '}
                                <span className="seller-order-detail__info-value">01234567890</span>
                            </p>
                        </div>
                        <div className="seller-order-detail__info-group seller-order-detail__info-group--address">
                            <div>
                                <div className="seller-order-detail__info-label">Địa chỉ</div>
                                <div className="seller-order-detail__info-value">
                                    Số 123 Đường ABC, Khu phố A, Tỉnh ABC
                                </div>
                            </div>
                            <button className="seller-order-detail__change-btn">Thay đổi</button>
                        </div>
                    </div>
                </div>

                {/* Payment Method Card */}
                <div className="seller-order-detail__card">
                    <h2 className="seller-order-detail__card-title">Phương thức thanh toán</h2>
                    <div className="seller-order-detail__payment-options">
                        <div className="seller-order-detail__payment-option">
                            <input type="radio" name="payment" id="payment-cash" defaultChecked />
                            <label htmlFor="payment-cash">
                                <img src={carIcon} alt="Cash payment" />
                                <span>Thanh toán khi nhận hàng</span>
                            </label>
                        </div>
                        <div className="seller-order-detail__payment-option">
                            <input type="radio" name="payment" id="payment-qrcode" />
                            <label htmlFor="payment-qrcode">
                                <img src={qrcodeIcon} alt="QR Code payment" />
                                <span>Thanh toán bằng mã QR</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="seller-order-detail__sidebar">
                <div className="seller-order-detail__summary">
                    <h2 className="seller-order-detail__summary-title">Thông tin đơn hàng</h2>
                    <div className="seller-order-detail__summary-row">
                        <span>Tổng tiền</span>
                        <span className="seller-order-detail__summary-price">220.000VND</span>
                    </div>
                    <div className="seller-order-detail__summary-row">
                        <span>Tổng khuyến mãi</span>
                        <span className="seller-order-detail__summary-price">-20.000VND</span>
                    </div>
                    <hr className="seller-order-detail__separator" />
                    <div className="seller-order-detail__summary-row seller-order-detail__summary-row--final">
                        <span>Cần thanh toán</span>
                        <span className="seller-order-detail__summary-price--final">
                            200.000VND
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
