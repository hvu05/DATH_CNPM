import { useState } from 'react';
import './status.scss';
import default_order from '@/assets/seller/default_order.webp';
import { useNavigate } from 'react-router-dom';

type OptionsFilter = 'all' | 'unupdate' | 'waiting' | 'delivering' | 'success' | 'failed';

export const StatusPage = () => {
    const [filter, setFilter] = useState<OptionsFilter>('all');
    const navigate = useNavigate();

    return (
        <div className="seller-status">
            <h1 className="seller-status__title">Đơn hàng</h1>

            <div className="seller-status__filter">
                <button
                    className={`seller-status__filter-option ${filter == 'all' ? 'seller-status__filter-option--active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    Tất cả
                </button>
                <button
                    className={`seller-status__filter-option ${filter == 'unupdate' ? 'seller-status__filter-option--active' : ''}`}
                    onClick={() => setFilter('unupdate')}
                >
                    Chưa cập nhật trạng thái
                </button>
                <button
                    className={`seller-status__filter-option ${filter == 'waiting' ? 'seller-status__filter-option--active' : ''}`}
                    onClick={() => setFilter('waiting')}
                >
                    Chờ giao hàng
                </button>
                <button
                    className={`seller-status__filter-option ${filter == 'delivering' ? 'seller-status__filter-option--active' : ''}`}
                    onClick={() => setFilter('delivering')}
                >
                    Đang giao hàng
                </button>
                <button
                    className={`seller-status__filter-option ${filter == 'success' ? 'seller-status__filter-option--active' : ''}`}
                    onClick={() => setFilter('success')}
                >
                    Đã giao hàng
                </button>
                <button
                    className={`seller-status__filter-option ${filter == 'failed' ? 'seller-status__filter-option--active' : ''}`}
                    onClick={() => setFilter('failed')}
                >
                    Giao hàng thất bại
                </button>
            </div>

            <div className="seller-status__list">
                <div className="seller-status__item">
                    <div className="seller-status__product-info">
                        <div className="seller-status__img-container">
                            <img
                                className="seller-status__img"
                                src={default_order}
                                alt="order_img"
                            />
                        </div>
                        <div className="seller-status__details">
                            <div className="seller-status__name">
                                Tên sản phẩm dài để test responsive
                            </div>
                            <div className="seller-status__category">Loại sản phẩm: USB China</div>
                            <div className="seller-status__quantity">Số lượng: 12</div>
                        </div>
                    </div>
                    <div className="seller-status__price-status">
                        <div className="seller-status__price">Giá: 2,000,000đ</div>
                        <div className="seller-status__status">Chờ xác nhận</div>
                        <button
                            onClick={() => navigate('/seller/order/1')}
                            className="seller-status__detail-link"
                        >
                            Chi tiết đơn hàng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
