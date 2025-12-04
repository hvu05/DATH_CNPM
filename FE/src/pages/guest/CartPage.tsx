import React, { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import type { CartItem } from '@/contexts/CartContext';
import { useAuthContext } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Empty, message, Divider, Checkbox, Modal, Tag, Spin } from 'antd';
import { DeleteOutlined, LoginOutlined, DownOutlined, CheckOutlined } from '@ant-design/icons';
import ProductCard from '@/components/common/ProductCard';
import { getProducts, getProductById } from '@/services/productsApi'; // Import thêm getProductById
import type { Product, BackendVariant } from '@/types/product';
import './CartPage.scss';

const CartPage: React.FC = () => {
    const {
        cartItems,
        updateQuantity,
        removeFromCart,
        addToCart,
        changeCartItemVariant,
        removeManyFromCart,
    } = useCart();
    const { isLoggedIn } = useAuthContext();
    const navigate = useNavigate();

    // Data
    const [recommended, setRecommended] = useState<Product[]>([]);

    // Checkbox State
    const [checkedItems, setCheckedItems] = useState<string[]>([]);
    const [checkAll, setCheckAll] = useState(false);

    // --- VARIANT MODAL STATE ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<CartItem | null>(null); // Item đang được sửa
    const [loadingVariants, setLoadingVariants] = useState(false);
    const [currentProductVariants, setCurrentProductVariants] = useState<BackendVariant[]>([]); // List variants của sp đang sửa
    const [selectedNewVariant, setSelectedNewVariant] = useState<BackendVariant | null>(null); // Variant mới user chọn

    // Helper tạo key unique
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

    const handleCheckout = () => {
        if (!isLoggedIn) {
            message.warning('Bạn chưa đăng nhập! Vui lòng đăng nhập để thanh toán.');
            return;
        }
        if (checkedItems.length === 0) {
            message.warning('Vui lòng chọn ít nhất 1 sản phẩm để thanh toán');
            return;
        }
        const selectedProducts = cartItems.filter(item => checkedItems.includes(getItemKey(item)));
        navigate('/client/order', {
            state: { orderItems: selectedProducts, total: totalSelected },
        });
    };

    const openVariantModal = async (item: CartItem) => {
        setEditingItem(item);
        setIsModalOpen(true);
        setLoadingVariants(true);

        try {
            const productDetail = await getProductById(item.productId);
            if (productDetail && productDetail.originalVariants) {
                setCurrentProductVariants(productDetail.originalVariants);

                const current = productDetail.originalVariants.find(v => v.id === item.variantId);
                setSelectedNewVariant(current || null);
            }
        } catch (error) {
            message.error('Không thể tải thông tin biến thể');
        } finally {
            setLoadingVariants(false);
        }
    };

    const handleConfirmChangeVariant = async () => {
        if (!editingItem || !selectedNewVariant) return;

        if (editingItem.variantId === selectedNewVariant.id) {
            setIsModalOpen(false);
            return;
        }

        const baseName = editingItem.name.split('(')[0].trim();
        const newName = `${baseName} (${selectedNewVariant.color} - ${selectedNewVariant.storage})`;

        await changeCartItemVariant(editingItem, {
            id: selectedNewVariant.id,
            name: newName,
            price: Number(selectedNewVariant.price),
            quantity: selectedNewVariant.quantity,
        });

        message.success('Đã cập nhật phân loại hàng');
        setIsModalOpen(false);
        setEditingItem(null);
    };
    const handleDeleteSelected = async () => {
        const toDelete = cartItems.filter(i => checkedItems.includes(getItemKey(i)));

        await removeManyFromCart(toDelete);

        setCheckedItems([]);
        message.success('Đã xóa các sản phẩm đã chọn');
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
                    <div className="cart-header-row">
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                width: '100%',
                            }}
                        >
                            <Checkbox checked={checkAll} onChange={onCheckAllChange}>
                                Chọn tất cả ({cartItems.length} sản phẩm)
                            </Checkbox>

                            {checkedItems.length > 0 && (
                                <Button danger type="link" onClick={handleDeleteSelected}>
                                    Xóa các sản phẩm đã chọn
                                </Button>
                            )}
                        </div>
                    </div>

                    {cartItems.map(item => {
                        const uniqueKey = getItemKey(item);
                        return (
                            <div className="cart-item" key={uniqueKey}>
                                <div className="cart-item__checkbox">
                                    <Checkbox
                                        checked={checkedItems.includes(uniqueKey)}
                                        onChange={e =>
                                            onCheckItemChange(uniqueKey, e.target.checked)
                                        }
                                    />
                                </div>

                                <div className="cart-item__overview">
                                    <Link
                                        to={`/product/${item.productId}`}
                                        className="cart-item__image-link"
                                    >
                                        <img
                                            src={item.imageUrl}
                                            alt={item.name}
                                            className="cart-item__image"
                                        />
                                    </Link>

                                    <div className="cart-item__details">
                                        <Link
                                            to={`/product/${item.productId}`}
                                            className="cart-item__name-link"
                                        >
                                            <h3 className="cart-item__name">{item.name}</h3>
                                        </Link>

                                        <div
                                            className="cart-item__variant-selector"
                                            onClick={() => openVariantModal(item)}
                                        >
                                            <span className="variant-label">Phân loại hàng:</span>
                                            <span className="variant-value">
                                                <DownOutlined
                                                    style={{ fontSize: 10, marginLeft: 4 }}
                                                />
                                            </span>
                                        </div>

                                        <p className="cart-item__price">
                                            {item.price.toLocaleString('vi-VN')}₫
                                        </p>
                                    </div>
                                </div>

                                <div className="cart-item__actions-wrapper">
                                    <div className="cart-item__quantity">
                                        <button
                                            onClick={() =>
                                                updateQuantity(
                                                    item.productId,
                                                    item.variantId,
                                                    item.quantity - 1
                                                )
                                            }
                                            disabled={item.quantity <= 1}
                                        >
                                            -
                                        </button>
                                        <input type="number" value={item.quantity} readOnly />
                                        <button
                                            onClick={() =>
                                                updateQuantity(
                                                    item.productId,
                                                    item.variantId,
                                                    item.quantity + 1
                                                )
                                            }
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div className="cart-item__total-price">
                                        {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                                    </div>

                                    <Button
                                        type="text"
                                        danger
                                        className="btn-delete"
                                        onClick={() =>
                                            removeFromCart(item.productId, item.variantId)
                                        }
                                    >
                                        Xóa
                                    </Button>
                                </div>
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

                    <Button type="primary" block size="large" onClick={handleCheckout}>
                        Mua Hàng
                    </Button>

                    {!isLoggedIn && (
                        <div className="login-warning">
                            <LoginOutlined /> Bạn cần đăng nhập để thanh toán
                        </div>
                    )}
                </div>
            </div>

            <Divider />

            <Modal
                title="Đổi phân loại hàng"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={[
                    <Button key="back" onClick={() => setIsModalOpen(false)}>
                        Hủy
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleConfirmChangeVariant}>
                        Xác nhận
                    </Button>,
                ]}
            >
                {loadingVariants ? (
                    <div style={{ textAlign: 'center', padding: 20 }}>
                        <Spin />
                    </div>
                ) : (
                    <div className="variant-change-content">
                        <div
                            className="current-product-info"
                            style={{ display: 'flex', gap: 10, marginBottom: 20 }}
                        >
                            <img
                                src={editingItem?.imageUrl}
                                alt="thumb"
                                style={{
                                    width: 50,
                                    height: 50,
                                    objectFit: 'cover',
                                    borderRadius: 4,
                                }}
                            />
                            <div>
                                <div style={{ fontWeight: 600 }}>{editingItem?.name}</div>
                                <div style={{ color: '#d70018' }}>
                                    {selectedNewVariant
                                        ? Number(selectedNewVariant.price).toLocaleString('vi-VN')
                                        : editingItem?.price.toLocaleString('vi-VN')}
                                    ₫
                                </div>
                            </div>
                        </div>

                        {currentProductVariants.length > 0 ? (
                            <div className="variant-options">
                                <p style={{ fontWeight: 600, marginBottom: 8 }}>Chọn phân loại:</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {currentProductVariants.map(v => {
                                        const isSelected = selectedNewVariant?.id === v.id;
                                        return (
                                            <Tag.CheckableTag
                                                key={v.id}
                                                checked={isSelected}
                                                onChange={() => setSelectedNewVariant(v)}
                                                style={{
                                                    padding: '6px 12px',
                                                    border: isSelected
                                                        ? '1px solid #d70018'
                                                        : '1px solid #d9d9d9',
                                                    background: isSelected ? '#fff1f0' : '#fff',
                                                    color: isSelected ? '#d70018' : '#333',
                                                    fontSize: 14,
                                                }}
                                            >
                                                {v.color} - {v.storage}
                                                {isSelected && (
                                                    <CheckOutlined style={{ marginLeft: 5 }} />
                                                )}
                                            </Tag.CheckableTag>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <p>Sản phẩm này không có biến thể khác.</p>
                        )}
                    </div>
                )}
            </Modal>

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
