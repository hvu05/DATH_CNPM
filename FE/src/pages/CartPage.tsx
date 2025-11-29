// FE/src/pages/CartPage.tsx
import React, { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuthContext } from '@/contexts/AuthContext'; // <--- 1. Import AuthContext
import { Link, useNavigate } from 'react-router-dom';
import { Button, Empty, message, Divider, Checkbox } from 'antd';
import { DeleteOutlined, LoginOutlined } from '@ant-design/icons';
import ProductCard from '@/components/common/ProductCard';
import { getProducts } from '@/services/productsApi';
import type { Product } from '@/types/product';
import './CartPage.scss';

const CartPage: React.FC = () => {
    const { cartItems, updateQuantity, removeFromCart } = useCart();
    const { isLoggedIn } = useAuthContext(); // <--- 2. Lấy trạng thái đăng nhập
    const navigate = useNavigate();
    const [recommended, setRecommended] = useState<Product[]>([]);

    // Sử dụng string key để tránh lỗi chọn nhầm
    const [checkedItems, setCheckedItems] = useState<string[]>([]);
    const [checkAll, setCheckAll] = useState(false);

    // Helper tạo unique key
    const getItemKey = (item: any) => `${item.productId}-${item.variantId}`;

    useEffect(() => {
        getProducts().then(data => setRecommended(data.slice(0, 4)));
    }, []);

    useEffect(() => {
        const allKeys = cartItems.map(getItemKey);
        const isAllChecked =
            cartItems.length > 0 && allKeys.every(key => checkedItems.includes(key));
        setCheckAll(isAllChecked);
    }, [checkedItems, cartItems]);

    const onCheckAllChange = (e: any) => {
        const checked = e.target.checked;
        if (checked) {
            setCheckedItems(cartItems.map(getItemKey));
        } else {
            setCheckedItems([]);
        }
    };

    const onCheckItemChange = (key: string, checked: boolean) => {
        if (checked) {
            setCheckedItems(prev => [...prev, key]);
        } else {
            setCheckedItems(prev => prev.filter(k => k !== key));
        }
    };

    const totalSelected = cartItems
        .filter(item => checkedItems.includes(getItemKey(item)))
        .reduce((sum, item) => sum + item.price * item.quantity, 0);

    // --- LOGIC THANH TOÁN MỚI ---
    const handleCheckout = () => {
        // 1. Kiểm tra đăng nhập trước
        if (!isLoggedIn) {
            message.warning('Bạn chưa đăng nhập! Vui lòng đăng nhập để thanh toán.');

            return;
        }

        // 2. Kiểm tra có chọn sản phẩm không
        if (checkedItems.length === 0) {
            message.warning('Vui lòng chọn ít nhất 1 sản phẩm để thanh toán');
            return;
        }

        const selectedProducts = cartItems.filter(item => checkedItems.includes(getItemKey(item)));

        navigate('/client/order', {
            state: { orderItems: selectedProducts, total: totalSelected },
        });
    };

    if (cartItems.length === 0) {
        return (
            <div className="container cart-empty" style={{ textAlign: 'center', padding: 50 }}>
                <Empty description="Giỏ hàng trống">
                    <Link to="/">
                        <Button type="primary">Mua sắm ngay</Button>
                    </Link>
                </Empty>
            </div>
        );
    }

    return (
        <div className="container cart-page">
            <h1>Giỏ hàng</h1>
            <div className="cart-layout">
                <div className="cart-items-list">
                    <div
                        style={{
                            marginBottom: 15,
                            background: '#fff',
                            padding: '10px 20px',
                            borderRadius: 8,
                        }}
                    >
                        <Checkbox checked={checkAll} onChange={onCheckAllChange}>
                            Chọn tất cả ({cartItems.length} sản phẩm)
                        </Checkbox>
                    </div>

                    {cartItems.map(item => {
                        const uniqueKey = getItemKey(item);
                        return (
                            <div className="cart-item" key={uniqueKey}>
                                <Checkbox
                                    style={{ marginRight: 15 }}
                                    checked={checkedItems.includes(uniqueKey)}
                                    onChange={e => onCheckItemChange(uniqueKey, e.target.checked)}
                                />
                                <Link to={`/product/${item.productId}`} className="cart-item__link">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.name}
                                        className="cart-item__image"
                                    />
                                </Link>
                                <div className="cart-item__info">
                                    <Link
                                        to={`/product/${item.productId}`}
                                        style={{ color: 'inherit', textDecoration: 'none' }}
                                    >
                                        <h3 className="cart-item__name">{item.name}</h3>
                                    </Link>
                                    <p className="cart-item__price">
                                        {item.price.toLocaleString('vi-VN')}₫
                                    </p>
                                </div>
                                <div className="cart-item__quantity">
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        min="1"
                                        onChange={e =>
                                            updateQuantity(
                                                item.productId, // Đảm bảo gọi đúng 3 tham số
                                                item.variantId,
                                                parseInt(e.target.value) || 1
                                            )
                                        }
                                    />
                                </div>
                                <div className="cart-item__total">
                                    {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                                </div>
                                <Button
                                    type="text"
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={() => removeFromCart(item.productId, item.variantId)}
                                />
                            </div>
                        );
                    })}
                </div>

                <div className="cart-summary">
                    <div style={{ marginBottom: 20 }}>
                        <span>
                            Đã chọn:{' '}
                            <strong style={{ color: '#d70018' }}>{checkedItems.length}</strong> sản
                            phẩm
                        </span>
                    </div>
                    <h3>Tạm tính: {totalSelected.toLocaleString('vi-VN')}₫</h3>

                    {/* Nút thanh toán */}
                    <Button type="primary" block size="large" onClick={handleCheckout}>
                        Mua Hàng
                    </Button>

                    {/* Dòng thông báo hiển thị nếu chưa đăng nhập (UX bổ sung) */}
                    {!isLoggedIn && (
                        <div
                            style={{
                                marginTop: 10,
                                color: '#faad14',
                                fontSize: '13px',
                                textAlign: 'center',
                            }}
                        >
                            <LoginOutlined /> Bạn cần đăng nhập để thanh toán
                        </div>
                    )}
                </div>
            </div>

            <Divider />
            <section className="recommended-products">
                <h2 className="section-title">Có thể bạn thích</h2>
                <div className="product-grid">
                    {recommended.map(p => (
                        <ProductCard key={p.id} {...p} />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default CartPage;
