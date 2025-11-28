import React, { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Empty, message, Divider, Checkbox } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import ProductCard from '@/components/common/ProductCard';
import { getProducts } from '@/services/productsApi';
import type { Product } from '@/types/product';
import './CartPage.scss';

const CartPage: React.FC = () => {
    const { cartItems, updateQuantity, removeFromCart } = useCart();
    const navigate = useNavigate();
    const [recommended, setRecommended] = useState<Product[]>([]);

    const [checkedItems, setCheckedItems] = useState<number[]>([]);
    const [checkAll, setCheckAll] = useState(false);

    useEffect(() => {
        getProducts().then(data => setRecommended(data.slice(0, 4)));
    }, []);

    const onCheckAllChange = (e: any) => {
        const checked = e.target.checked;
        setCheckAll(checked);
        if (checked) {
            setCheckedItems(cartItems.map(item => item.variantId));
        } else {
            setCheckedItems([]);
        }
    };

    const onCheckItemChange = (variantId: number, checked: boolean) => {
        let newChecked = [...checkedItems];
        if (checked) {
            newChecked.push(variantId);
        } else {
            newChecked = newChecked.filter(id => id !== variantId);
        }
        setCheckedItems(newChecked);
        setCheckAll(newChecked.length === cartItems.length && cartItems.length > 0);
    };

    const totalSelected = cartItems
        .filter(item => checkedItems.includes(item.variantId))
        .reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleCheckout = () => {
        if (checkedItems.length === 0) {
            message.warning('Vui lòng chọn ít nhất 1 sản phẩm để thanh toán');
            return;
        }
        const selectedProducts = cartItems.filter(item => checkedItems.includes(item.variantId));

        navigate('/client/order', {
            state: { orderItems: selectedProducts, total: totalSelected },
        });
    };

    if (cartItems.length === 0) {
        return (
            <div className="container cart-empty">
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
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <Checkbox checked={checkAll} onChange={onCheckAllChange}>
                            Chọn tất cả ({cartItems.length} sản phẩm)
                        </Checkbox>
                    </div>

                    {cartItems.map(item => (
                        <div className="cart-item" key={item.variantId}>
                            <Checkbox
                                style={{ marginRight: 15 }}
                                checked={checkedItems.includes(item.variantId)}
                                onChange={e => onCheckItemChange(item.variantId, e.target.checked)}
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
                                onClick={() => removeFromCart(item.variantId)}
                            />
                        </div>
                    ))}
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
                    <Button type="primary" block size="large" onClick={handleCheckout}>
                        Mua Hàng
                    </Button>
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
