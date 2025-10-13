import { useParams } from 'react-router'
import './detail.scss'
import defaultItem from '@/assets/seller/default_order.webp'
import { Fragment } from 'react/jsx-runtime';
import carIcon from '@/assets/seller/car.svg'
import qrcodeIcon from '@/assets/seller/qrcode.svg'

export const DetailPage = () => {
    const { id } = useParams();
    return (
        <>
            <div className="detail-order">
                <div className="detail-order__left">
                    {/* list of item */}
                    <div className='detail-order__items'>
                        <div className="detail-order__title">Sản phẩm trong đơn (2)</div>
                        {/* item in order */}
                        {new Array(2).fill(0).map((item, index) => (
                            <Fragment key={index}>
                                <div className="detail-order__item">
                                    <div className="detail-order__item-left">
                                        <div className="detail-order__item-img-container">
                                            <img src={defaultItem} alt="item" />
                                        </div>
                                        <div className="detail-order__item-info">
                                            <h3 className='detail-order__item-name'>Tên sản phẩm</h3>
                                            <div className="detail-order__item-attr">
                                                <div className="detail-order__item-color">Color : black</div>
                                                <div className="detail-order__item-quantity">Quantity: 10</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="detail-order__item-right">100.000VND</div>
                                </div>
                                <div className='detail-order__hr'></div>
                            </Fragment>
                        ))}
                    </div>
                    {/* customer information  */}
                    <div className="detail-order__items">
                        <div className="detail-order__title">Thông tin khách hàng</div>
                        <div className="detail-order__info-item">
                            <span className="detail-order__info-label">Họ và tên: {' '}</span>
                            <span className="detail-order__info-value">Lê Nguyễn Văn Sĩ</span>
                            <div></div>
                            <span className="detail-order__info-label">Số điện thoại: {' '}</span>
                            <span className="detail-order__info-value">
                                01234567890
                            </span>
                        </div>
                        <div className="detail-order__info-item detail-order__info-item-box">
                            <div className="detail-order__info-label">Địa chỉ</div>
                            <div className="detail-order__info-value">Số 123 Đường ABC, Khu phố A, Tỉnh ABC</div>
                            <button className='detail-order__info-btn'>Thay đổi</button>
                        </div>
                    </div>
                    {/* payment method  */}
                    <div className="detail-order__items">
                        <div className="detail-order__title">
                            Phương thức thanh toán
                        </div>
                        <div className="detail-order__payment">
                            <div className="detail-order__payment-method">
                                <input type="radio" name='payment' id='detail-order__payment-method-cash' />
                                <img src={carIcon} alt="carIcon" />
                                <label htmlFor='detail-order__payment-method-cash'>Thanh toán khi nhận hàng</label>
                            </div>
                            <div className="detail-order__payment-method">
                                <input type="radio" name='payment' id='detail-order__payment-method-qrcode' />
                                <img src={qrcodeIcon} alt="carIcon" />
                                <label htmlFor='detail-order__payment-method-qrcode'>Thanh toán khi nhận hàng</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="detail-order__right">
                    <div className="detail-order__right-title">Thông tin đơn hàng</div>
                    <div className="detail-order__right-row">
                        <div className="detail-order__right-label">Tổng tiền</div>
                        <div className="detail-order__right-price">220.000VND</div>
                    </div>
                    <div className="detail-order__right-row">
                        <div className="detail-order__right-label">Tổng khuyến mãi</div>
                        <div className="detail-order__right-price">220.000VND</div>
                    </div>
                    <div className="detail-order__right-row">
                        <div className="detail-order__right-label">Cần thanh toán</div>
                        <div className="detail-order__right-price--final">220.000VND</div>
                    </div>
                </div>
            </div>
        </>
    )
}