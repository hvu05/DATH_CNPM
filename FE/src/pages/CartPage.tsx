// FE/src/pages/CartPage.tsx
import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { Link } from 'react-router-dom';
import { Button, Empty, message, Divider } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import ProductCard from '@/components/common/ProductCard';
import { products } from '@/services/MockData';
import './CartPage.scss';

const CartPage: React.FC = () => {
    const { cartItems, updateQuantity, removeFromCart } = useCart();

    // helper to get product id from different cart item shapes
    const getIdValue = (item: any): string | number => {
        if (item == null) return '';
        return item.id ?? item.productId ?? item.product_id ?? item.sku ?? '';
    };

    if (!cartItems || cartItems.length === 0) {
        return (
            <div className="container cart-empty">
                <Empty description="Giỏ hàng của bạn đang trống">
                    <Link to="/">
                        <Button type="primary">Tiếp tục mua sắm</Button>
                    </Link>
                </Empty>
            </div>
        );
    }

    const total = cartItems.reduce(
        (sum, item: any) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
        0
    );

    const handleRemoveFromCart = (rawId: string | number) => {
        const idNum = typeof rawId === 'number' ? rawId : Number(rawId);
        removeFromCart(idNum);
        message.success('Đã xóa sản phẩm khỏi giỏ hàng');
    };

    // Lấy các sản phẩm đề xuất (ngẫu nhiên) - keep MockData for suggestions or replace with API
    const recommendedProducts = products
        .filter(p => !cartItems.some((item: any) => String(getIdValue(item)) === String(p.id)))
        .sort(() => Math.random() - 0.5)
        .slice(0, 4);

    return (
        <div className="container cart-page">
            <h1>Giỏ hàng</h1>
            <div className="cart-layout">
                <div className="cart-items-list">
                    {cartItems.map((item: any) => {
                        const rawId = getIdValue(item);
                        const idNum = typeof rawId === 'number' ? rawId : Number(rawId);
                        return (
                            <div className="cart-item" key={String(rawId)}>
                                <img
                                    src={item.imageUrl ?? item.image ?? '/placeholder.png'}
                                    alt={item.name}
                                    className="cart-item__image"
                                />
                                <div className="cart-item__info">
                                    <h3 className="cart-item__name">{item.name}</h3>
                                    <p className="cart-item__price">
                                        {(Number(item.price) || 0).toLocaleString('vi-VN')}₫
                                    </p>
                                </div>
                                <div className="cart-item__quantity">
                                    <input
                                        type="number"
                                        value={Number(item.quantity) || 1}
                                        min="1"
                                        onChange={e =>
                                            updateQuantity(
                                                idNum,
                                                Number.parseInt(e.target.value, 10) || 1
                                            )
                                        }
                                    />
                                </div>
                                <div className="cart-item__total">
                                    {(
                                        (Number(item.price) || 0) * (Number(item.quantity) || 0)
                                    ).toLocaleString('vi-VN')}
                                    ₫
                                </div>
                                <Button
                                    type="text"
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={() => handleRemoveFromCart(idNum)}
                                />
                            </div>
                        );
                    })}
                </div>
                <div className="cart-summary">
                    <h3>Thành tiền: {total.toLocaleString('vi-VN')}₫</h3>
                    <Button type="primary" block size="large">
                        Tiến hành đặt hàng
                    </Button>
                </div>
            </div>

            <Divider />

            <section className="recommended-products">
                <h2 className="section-title">Gợi ý cho bạn</h2>
                <div className="product-grid">
                    {recommendedProducts.map(product => (
                        <ProductCard key={product.id} {...product} />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default CartPage;
