import './order.scss'
import default_order from '@/assets/seller/default_order.webp'

export const OrderPage = () => {
    return (
        <>
            <div className="seller-order">
                <div className="seller-order__title">
                    Đơn hàng
                </div>
                <div className="seller-order__filter">
                    <div className="seller-order__filter-option">Tất cả</div>
                    <div className="seller-order__filter-option">Đang chờ xác nhận</div>
                    <div className="seller-order__filter-option">Đã xác nhận</div>
                    <div className="seller-order__filter-option">Đã từ chối xác nhận</div>
                </div>
                <div className="seller-order__orders">
                    <div className="seller-order__order">
                        <div className="seller-order__img-container">
                            <img className="seller-order__img" src={default_order} alt='order_img'></img>
                        </div>
                        <div className="seller-order__order-info">
                            <div className="seller-order__name">Tên sản phẩm: </div>
                            <div className="seller-order__category">Loại sản phẩm: </div>
                            <div className="seller-order__quantity">So luong: 12</div>
                        </div>
                        <div className="seller-order__price">Giá: 2000000</div>
                        <div className="seller-order__actions">
                            <div className="seller-order__status">Chớ xác nhận</div>
                            <div className="seller-order__detail">Chi tiết đơn hàng</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}