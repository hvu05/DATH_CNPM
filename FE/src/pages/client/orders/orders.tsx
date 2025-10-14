import {useState} from "react";
import {useNavigate} from "react-router";
import default_order from "@/assets/seller/default_order.webp";
import '@/pages/client/orders/index.scss'

type OptionsFilter = 'all' | 'waitingpay' | 'shipping' | 'processing' | 'succeeded' | 'return' | 'cancelled'

export const ClientOrder = () => {
    const [filter, setFilter] = useState<OptionsFilter>('all');
    const navigate = useNavigate();

    return (
        <div className="client-order">
            <h1 className="client-order__title">Đơn hàng</h1>

            <div className="client-order__filter">
                <button
                    className={`client-order__filter-option ${filter == 'all' ? 'client-order__filter-option--active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    Tất cả</button>
                <button
                    className={`client-order__filter-option ${filter == 'waitingpay' ? 'client-order__filter-option--active' : ''}`}
                    onClick={() => setFilter('waitingpay')}
                >
                    Đang chờ thanh toán</button>
                <button
                    className={`client-order__filter-option ${filter == 'processing' ? 'client-order__filter-option--active' : ''}`}
                    onClick={() => setFilter('processing')}
                >
                    Đang xử lý</button>
                <button
                    className={`client-order__filter-option ${filter == 'shipping' ? 'client-order__filter-option--active' : ''}`}
                    onClick={() => setFilter('shipping')}
                >
                    Đang giao</button>
                <button
                    className={`client-order__filter-option ${filter == 'succeeded' ? 'client-order__filter-option--active' : ''}`}
                    onClick={() => setFilter('succeeded')}
                >
                    Giao hàng thành công</button>
                <button
                    className={`client-order__filter-option ${filter == 'return' ? 'client-order__filter-option--active' : ''}`}
                    onClick={() => setFilter('return')}
                >
                    Trả hàng</button>
                <button
                    className={`client-order__filter-option ${filter == 'cancelled' ? 'client-order__filter-option--active' : ''}`}
                    onClick={() => setFilter('cancelled')}
                >
                    Trả hàng</button>
            </div >

            <div className="client-order__list">
                <div className="client-order__item">
                    <div className="client-order__product-info">
                        <div className="client-order__img-container">
                            <img className="client-order__img" src={default_order} alt='order_img' />
                        </div>
                        <div className="client-order__details">
                            <div className="client-order__name">Tên sản phẩm dài để test responsive</div>
                            <div className="client-order__category">Loại sản phẩm: USB China</div>
                            <div className="client-order__quantity">Số lượng: 12</div>
                        </div>
                    </div>
                    <div className="client-order__price-status">
                        <div className="client-order__price">Giá: 2,000,000đ</div>
                        <div className="client-order__status">Chờ xác nhận</div>
                        <button onClick={() => navigate('/client/order/1')} className="client-order__detail-link">Chi tiết đơn hàng</button>
                    </div>
                </div>
            </div>
        </div >
    )
}