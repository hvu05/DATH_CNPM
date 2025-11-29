// FE/src/pages/ProductDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, getProducts, getProductReviews } from '@/services/productsApi';
import type { Product, BackendVariant } from '@/types/product';
import { useCart } from '@/contexts/CartContext';
import { Button, message, Rate, Tabs, Avatar, Divider, Tag, Skeleton, Input } from 'antd';
import { UserOutlined, ShoppingCartOutlined, ThunderboltOutlined } from '@ant-design/icons';
import ProductCard from '@/components/common/ProductCard';
import './ProductDetailPage.scss';

const { TextArea } = Input;

const ProductDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [selectedVariant, setSelectedVariant] = useState<BackendVariant | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [reviews, setReviews] = useState<any[]>([]);

    useEffect(() => {
        if (id) {
            getProductById(id).then(data => {
                setProduct(data);
                // Mặc định chọn variant rẻ nhất
                if (data?.originalVariants && data.originalVariants.length > 0) {
                    const sorted = [...data.originalVariants].sort(
                        (a, b) => Number(a.price) - Number(b.price)
                    );
                    setSelectedVariant(sorted[0]);
                }
                if (data) {
                    getProducts().then(all =>
                        setRelatedProducts(all.filter(p => p.id !== data.id).slice(0, 4))
                    );
                }
            });
            getProductReviews(id).then(res => setReviews(res));
            window.scrollTo(0, 0);
        }
    }, [id]);

    // TÍNH TOÁN DỮ LIỆU HIỂN THỊ
    const displayPrice = selectedVariant ? Number(selectedVariant.price) : product?.price || 0;
    const stock = selectedVariant ? selectedVariant.quantity : 0;
    const isOutOfStock = stock <= 0;

    // TÍNH RATING TRUNG BÌNH
    const avgRating =
        reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.vote, 0) / reviews.length
            : product?.rating || 5;

    const handleQuantityChange = (val: number) => {
        if (val < 1) val = 1;
        if (val > stock) {
            // message.warning(`Chỉ còn ${stock} sản phẩm trong kho`); // Có thể bật lại nếu muốn spam noti
            val = stock;
        }
        setQuantity(val);
    };

    const handleAddToCart = async (isBuyNow = false) => {
        if (!product) return;

        // Kiểm tra tồn kho
        if (stock <= 0) {
            message.error('Sản phẩm này đang tạm hết hàng');
            return;
        }
        if (quantity > stock) {
            message.error(`Chỉ còn ${stock} sản phẩm trong kho`);
            return;
        }

        const finalQty = quantity > stock ? stock : quantity;

        const finalVariantId = selectedVariant?.id || product.id;

        await addToCart({
            productId: Number(product.id),
            variantId: finalVariantId,
            name: `${product.name} ${selectedVariant ? `(${selectedVariant.color})` : ''}`,
            price: displayPrice,
            imageUrl: product.imageUrl,
            quantity: finalQty,
        });

        if (isBuyNow) {
            navigate('/cart');
        } else {
            message.success('Đã thêm vào giỏ hàng thành công!');
        }
    };

    if (!product)
        return (
            <div className="container" style={{ padding: 50 }}>
                <Skeleton active />
            </div>
        );

    const images = product.originalImages?.length
        ? product.originalImages.map(i => i.image_url)
        : [product.imageUrl];

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <section className="product-detail">
                {/* GALLERY */}
                <div className="product-detail__gallery">
                    <div className="main-image-container">
                        <img
                            src={images[selectedImageIndex] || images[0]}
                            alt={product.name}
                            className="main-image"
                        />
                    </div>
                    <div className="thumbnail-container">
                        {images.map((img, idx) => (
                            <img
                                key={idx}
                                src={img}
                                className={`thumbnail ${selectedImageIndex === idx ? 'active' : ''}`}
                                onClick={() => setSelectedImageIndex(idx)}
                                alt="thumb"
                            />
                        ))}
                    </div>
                </div>

                {/* INFO */}
                <div className="product-detail__info">
                    <h1 className="product-detail__title">{product.name}</h1>

                    <div
                        className="product-detail__rating"
                        style={{ display: 'flex', alignItems: 'center', gap: 10 }}
                    >
                        <span style={{ fontWeight: 'bold', fontSize: 18, color: '#fadb14' }}>
                            {avgRating.toFixed(1)}
                        </span>
                        <Rate disabled allowHalf value={avgRating} />
                        <span className="product-detail__rating-text" style={{ color: '#666' }}>
                            ({reviews.length} đánh giá)
                        </span>
                    </div>

                    <div className="product-detail__price-container">
                        <p className="product-detail__price">
                            {displayPrice.toLocaleString('vi-VN')}₫
                        </p>
                        <p className="product-detail__original-price">
                            {(displayPrice * 1.1).toLocaleString('vi-VN')}₫
                        </p>
                        {isOutOfStock && (
                            <Tag
                                color="red"
                                style={{ marginLeft: 10, fontSize: 14, padding: '4px 8px' }}
                            >
                                HẾT HÀNG
                            </Tag>
                        )}
                    </div>

                    {/* VARIANT */}
                    {product.originalVariants && product.originalVariants.length > 0 && (
                        <div style={{ marginTop: 20 }}>
                            <p style={{ fontWeight: 600 }}>Phiên bản:</p>
                            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                {product.originalVariants.map(v => (
                                    <Button
                                        key={v.id}
                                        type={selectedVariant?.id === v.id ? 'primary' : 'default'}
                                        onClick={() => {
                                            setSelectedVariant(v);
                                            setQuantity(1);
                                        }}
                                        className={
                                            selectedVariant?.id === v.id ? 'active-variant' : ''
                                        }
                                    >
                                        {v.color} - {v.storage}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STOCK & QUANTITY */}
                    <div
                        className="product-detail__quantity"
                        style={{
                            marginTop: 20,
                            background: '#f9f9f9',
                            padding: 15,
                            borderRadius: 8,
                        }}
                    >
                        <div style={{ marginBottom: 10, fontWeight: 500 }}>
                            Kho hàng:{' '}
                            {isOutOfStock ? (
                                <span style={{ color: 'red' }}>Hết hàng</span>
                            ) : (
                                <span style={{ color: 'green' }}>Còn {stock} sản phẩm</span>
                            )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                            <span style={{ fontWeight: 600 }}>Số lượng:</span>
                            <div className="quantity-selector">
                                <button
                                    onClick={() => handleQuantityChange(quantity - 1)}
                                    disabled={isOutOfStock}
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={e =>
                                        handleQuantityChange(parseInt(e.target.value) || 1)
                                    }
                                    disabled={isOutOfStock}
                                    max={stock}
                                />
                                <button
                                    onClick={() => handleQuantityChange(quantity + 1)}
                                    disabled={isOutOfStock}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ACTIONS */}
                    <div
                        className="product-detail__actions"
                        style={{ marginTop: 20, display: 'flex', gap: 15 }}
                    >
                        <Button
                            type="primary"
                            ghost
                            size="large"
                            icon={<ShoppingCartOutlined />}
                            onClick={() => handleAddToCart(false)}
                            disabled={isOutOfStock}
                            style={{ height: 50, fontSize: 16, flex: 1 }}
                        >
                            Thêm vào giỏ
                        </Button>
                        <Button
                            type="primary"
                            danger
                            size="large"
                            icon={<ThunderboltOutlined />}
                            onClick={() => handleAddToCart(true)}
                            disabled={isOutOfStock}
                            style={{ height: 50, fontSize: 16, flex: 1 }}
                        >
                            Mua ngay
                        </Button>
                    </div>
                </div>
            </section>

            <section className="product-tabs">
                <Tabs
                    items={[
                        {
                            key: '1',
                            label: 'Mô tả chi tiết',
                            children: (
                                <div style={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                                    {product.description || 'Đang cập nhật...'}
                                </div>
                            ),
                        },
                        {
                            key: '2',
                            label: `Đánh giá (${reviews.length})`,
                            children: (
                                <div className="product-reviews">
                                    {reviews.map((r, i) => (
                                        <div key={i} className="review-item">
                                            <div style={{ display: 'flex', gap: 10 }}>
                                                <Avatar icon={<UserOutlined />} />
                                                <div>
                                                    <div style={{ fontWeight: 'bold' }}>
                                                        {r.user?.full_name || 'Khách'}
                                                    </div>
                                                    <Rate
                                                        disabled
                                                        value={r.vote}
                                                        style={{ fontSize: 12 }}
                                                    />
                                                    <div style={{ color: '#888', fontSize: 12 }}>
                                                        {new Date(r.create_at).toLocaleDateString(
                                                            'vi-VN'
                                                        )}
                                                    </div>
                                                    <p style={{ marginTop: 5 }}>{r.comment}</p>
                                                </div>
                                            </div>
                                            <Divider style={{ margin: '12px 0' }} />
                                        </div>
                                    ))}
                                </div>
                            ),
                        },
                    ]}
                />
            </section>

            <section className="related-products">
                <h2 className="section-title">Sản phẩm liên quan</h2>
                <div className="product-grid">
                    {relatedProducts.map(rp => (
                        <ProductCard key={rp.id} {...rp} />
                    ))}
                </div>
            </section>
        </div>
    );
};
export default ProductDetailPage;
