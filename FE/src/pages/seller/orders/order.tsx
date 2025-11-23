import { useEffect, useState } from 'react';
import './order.scss';
import default_order from '@/assets/seller/default_order.webp';
import { useNavigate } from 'react-router';
import { ProductOutlined } from '@ant-design/icons';
import { getAllOrders, type IGetOrdersParams } from '@/services/seller/seller.service';

type OptionsFilter = 'all' | 'confirmed' | 'waiting' | 'rejected';

export const OrderPage = () => {
    const [filter, setFilter] = useState<OptionsFilter>('all');
    const [params, setParams] = useState<IGetOrdersParams>({ page: 1, limit: 10 });
    const navigate = useNavigate();

    useEffect(() => {
        const loadOrder = async () => {
            try {
                params['status'] = 'CONFIRMED';
                const result = await getAllOrders(params);
                if (result.data) {
                    console.log(result.data);
                }
            } catch (error) {}
        };
        loadOrder();
    }, []);

    return (
        <div className="seller-order">
            <h1 className="seller-order__title text-2xl">
                <ProductOutlined /> Quản lí đơn hàng
            </h1>

            <div className="seller-order__filter">
                <button
                    className={`seller-order__filter-option ${filter == 'all' ? 'seller-order__filter-option--active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    Tất cả
                </button>
                <button
                    className={`seller-order__filter-option ${filter == 'waiting' ? 'seller-order__filter-option--active' : ''}`}
                    onClick={() => setFilter('waiting')}
                >
                    Đang chờ xác nhận
                </button>
                <button
                    className={`seller-order__filter-option ${filter == 'confirmed' ? 'seller-order__filter-option--active' : ''}`}
                    onClick={() => setFilter('confirmed')}
                >
                    Đã xác nhận
                </button>
                <button
                    className={`seller-order__filter-option ${filter == 'rejected' ? 'seller-order__filter-option--active' : ''}`}
                    onClick={() => setFilter('rejected')}
                >
                    Đã từ chối
                </button>
            </div>

            <div className="seller-order__list">
                <div className="seller-order__item">
                    <div className="seller-order__product-info">
                        <div className="seller-order__img-container">
                            <img
                                className="seller-order__img"
                                src={default_order}
                                alt="order_img"
                            />
                        </div>
                        <div className="seller-order__details">
                            <div className="seller-order__name">
                                Tên sản phẩm dài để test responsive
                            </div>
                            <div className="seller-order__category">Loại sản phẩm: USB China</div>
                            <div className="seller-order__quantity">Số lượng: 12</div>
                        </div>
                    </div>
                    <div className="seller-order__price-status">
                        <div className="seller-order__price">Giá: 2,000,000đ</div>
                        <div className="seller-order__status">Chờ xác nhận</div>
                        <button
                            onClick={() => navigate('/seller/order/1')}
                            className="seller-order__detail-link"
                        >
                            Chi tiết đơn hàng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
