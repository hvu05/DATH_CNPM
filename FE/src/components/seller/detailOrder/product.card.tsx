import { formatCurrency } from '@/helpers/seller/helper';
import type { IOrder } from '@/services/seller/seller.service';
import { Fragment } from 'react/jsx-runtime';
import defaultItem from '@/assets/seller/default_order.webp';

export const ProductCard = ({ orderData }: { orderData: IOrder }) => {
    return (
        <>
            <div className="seller-order-detail__card">
                <h2 className="seller-order-detail__card-title">
                    Sản phẩm trong đơn ({orderData.order_items?.length || 0})
                </h2>
                <div className="seller-order-detail__product-list">
                    {orderData.order_items?.map((item, index) => (
                        <Fragment key={item.id}>
                            <div className="seller-order-detail__product-item">
                                <div className="seller-order-detail__product-info">
                                    <div className="seller-order-detail__product-img-container">
                                        <img
                                            src={item.product_variant?.thumbnail || defaultItem}
                                            alt={item.product_variant?.name || 'Sản phẩm'}
                                        />
                                    </div>
                                    <div className="seller-order-detail__product-details">
                                        <h3 className="seller-order-detail__product-name">
                                            {item.product_variant?.name || 'Sản phẩm'}
                                        </h3>
                                        <div className="seller-order-detail__product-attrs">
                                            <span>
                                                Màu sắc: {item.product_variant?.color || 'N/A'}
                                            </span>
                                            <span>
                                                Dung lượng: {item.product_variant?.storage || 'N/A'}
                                            </span>
                                            <span>Số lượng: {item.quantity}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="seller-order-detail__product-price">
                                    {formatCurrency(
                                        parseFloat(item.price_per_item) * item.quantity
                                    )}
                                </div>
                            </div>
                            {index < (orderData.order_items?.length || 0) - 1 && (
                                <hr className="seller-order-detail__separator" />
                            )}
                        </Fragment>
                    ))}
                </div>
            </div>
        </>
    );
};
