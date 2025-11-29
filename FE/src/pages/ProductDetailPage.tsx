// FE/src/pages/ProductDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, getProducts } from '@/services/productsApi';
import type { Product, BackendVariant } from '@/types/product';
import { useCart } from '@/contexts/CartContext';
import { Button, message, Rate, Tabs, Input, Skeleton, Tag } from 'antd';
import ProductCard from '@/components/common/ProductCard';
import './ProductDetailPage.scss';

const ProductDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

    // State quản lý Variant
    const [selectedVariant, setSelectedVariant] = useState<BackendVariant | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    useEffect(() => {
        if (id) {
            getProductById(id).then(data => {
                setProduct(data);
                // Tự động chọn variant đầu tiên (giá thấp nhất)
                if (data?.originalVariants && data.originalVariants.length > 0) {
                    const sorted = [...data.originalVariants].sort(
                        (a, b) => Number(a.price) - Number(b.price)
                    );
                    setSelectedVariant(sorted[0]);
                }

                // Fetch related
                if (data) {
                    getProducts().then(all =>
                        setRelatedProducts(all.filter(p => p.id !== data.id).slice(0, 4))
                    );
                }
            });
            window.scrollTo(0, 0);
        }
    }, [id]);

    // Lấy thông tin hiển thị dựa trên variant đang chọn
    const displayPrice = selectedVariant ? Number(selectedVariant.price) : product?.price || 0;
    const stock = selectedVariant ? selectedVariant.quantity : 0;
    const isOutOfStock = stock <= 0;

    // Xử lý logic số lượng
    const handleQuantityChange = (val: number) => {
        if (val < 1) val = 1;
        if (val > stock) {
            message.warning(`Kho chỉ còn ${stock} sản phẩm`);
            val = stock;
        }
        setQuantity(val);
    };

    const handleAddToCart = (isBuyNow = false) => {
        if (!product || !selectedVariant) {
            message.error('Sản phẩm này tạm thời chưa có phiên bản để mua');
            return;
        }
        if (quantity > stock) {
            message.error('Số lượng vượt quá tồn kho');
            return;
        }

        addToCart({
            productId: Number(product.id),
            variantId: selectedVariant.id, // ID chuẩn của variant trong DB
            name: `${product.name} (${selectedVariant.color} - ${selectedVariant.storage})`,
            price: Number(selectedVariant.price),
            imageUrl: product.imageUrl,
            quantity: quantity,
        });

        if (isBuyNow) navigate('/cart');
        else message.success('Đã thêm vào giỏ hàng!');
    };

    if (!product)
        return (
            <div className="container" style={{ padding: 50 }}>
                <Skeleton active />
            </div>
        );

    // Render ảnh
    const images = product.originalImages?.length
        ? product.originalImages.map(i => i.image_url)
        : [product.imageUrl];

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <section className="product-detail">
                {/* ẢNH SẢN PHẨM */}
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

                {/* THÔNG TIN CHÍNH */}
                <div className="product-detail__info">
                    <h1 className="product-detail__title">{product.name}</h1>
                    <div className="product-detail__rating">
                        <Rate disabled allowHalf value={product.rating || 5} />
                        <span className="product-detail__rating-text">(0 đánh giá)</span>
                    </div>

                    {/* GIÁ & KHUYẾN MÃI */}
                    <div className="product-detail__price-container">
                        {displayPrice > 0 ? (
                            <>
                                <p className="product-detail__price">
                                    {displayPrice.toLocaleString('vi-VN')}₫
                                </p>
                                <p className="product-detail__original-price">
                                    {(displayPrice * 1.1).toLocaleString('vi-VN')}₫
                                </p>
                                <span className="product-detail__discount">-10%</span>
                            </>
                        ) : (
                            <p className="product-detail__price" style={{ color: 'orange' }}>
                                Liên hệ
                            </p>
                        )}
                    </div>

                    {/* CHỌN PHIÊN BẢN (VARIANT) */}
                    {product.originalVariants && product.originalVariants.length > 0 && (
                        <div className="variant-selector" style={{ marginBottom: 20 }}>
                            <p style={{ fontWeight: 600, marginBottom: 8 }}>Chọn phiên bản:</p>
                            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                {product.originalVariants.map(v => (
                                    <Button
                                        key={v.id}
                                        type={selectedVariant?.id === v.id ? 'primary' : 'default'}
                                        onClick={() => {
                                            setSelectedVariant(v);
                                            setQuantity(1); // Reset số lượng khi đổi variant
                                        }}
                                        disabled={v.quantity <= 0}
                                        className={
                                            selectedVariant?.id === v.id ? 'active-variant' : ''
                                        }
                                    >
                                        {v.color} / {v.storage} - {Number(v.price).toLocaleString()}
                                        đ
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* TRẠNG THÁI KHO & SỐ LƯỢNG */}
                    <div className="product-detail__quantity">
                        <div style={{ marginBottom: 10 }}>
                            Trạng thái:{' '}
                            {isOutOfStock ? (
                                <Tag color="red">Hết hàng</Tag>
                            ) : (
                                <Tag color="green">Còn hàng ({stock})</Tag>
                            )}
                        </div>

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
                                onChange={e => handleQuantityChange(parseInt(e.target.value) || 1)}
                                disabled={isOutOfStock}
                            />
                            <button
                                onClick={() => handleQuantityChange(quantity + 1)}
                                disabled={isOutOfStock}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* BUTTON MUA */}
                    <div className="product-detail__actions">
                        <Button
                            type="primary"
                            size="large"
                            onClick={() => handleAddToCart(false)}
                            disabled={isOutOfStock}
                        >
                            Thêm vào giỏ
                        </Button>
                        <Button
                            type="primary"
                            danger
                            size="large"
                            onClick={() => handleAddToCart(true)}
                            disabled={isOutOfStock}
                        >
                            Mua ngay
                        </Button>
                    </div>

                    {/* CHÍNH SÁCH */}
                    <div className="product-detail__policies">
                        <div className="policy-item">
                            <span>✓</span> Bảo hành chính hãng 12 tháng
                        </div>
                        <div className="policy-item">
                            <span>✓</span> Đổi trả trong 30 ngày
                        </div>
                    </div>
                </div>
            </section>

            {/* TABS DESCRIPTION */}
            <section className="product-tabs">
                <Tabs
                    items={[
                        {
                            key: '1',
                            label: 'Mô tả sản phẩm',
                            children: (
                                <div
                                    className="product-description"
                                    style={{ whiteSpace: 'pre-line' }}
                                >
                                    {product.description || 'Chưa có mô tả chi tiết.'}
                                </div>
                            ),
                        },
                        // Có thể thêm Tab đánh giá ở đây
                    ]}
                />
            </section>

            {/* SẢN PHẨM LIÊN QUAN */}
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
