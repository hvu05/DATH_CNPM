// FE/src/pages/ProductDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '@/services/productsApi'; // API
import type { Product } from '@/types/product';
import { useCart } from '@/contexts/CartContext';
import { Button, message, Rate, Tabs, Avatar, Divider } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './ProductDetailPage.scss';

const ProductDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { addToCart } = useCart();
    const [product, setProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState(1);

    // State quản lý biến thể (Variant)
    const [selectedVariant, setSelectedVariant] = useState<any>(null);

    useEffect(() => {
        if (id) {
            getProductById(id).then(data => {
                setProduct(data);
                // Mặc định chọn variant đầu tiên nếu có
                if (data?.originalData?.product_variants?.length) {
                    setSelectedVariant(data.originalData.product_variants[0]);
                }
            });
        }
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;
        // Nếu có variant, dùng giá của variant, không thì dùng giá mặc định
        const finalPrice = selectedVariant ? selectedVariant.price : product.price;
        const variantName = selectedVariant
            ? `${product.name} (${selectedVariant.color || ''} ${selectedVariant.storage || ''})`
            : product.name;

        addToCart({
            id: product.id, // Lưu ý: CartContext nên hỗ trợ variantId nếu muốn chuẩn xác
            name: variantName,
            price: finalPrice,
            imageUrl: product.imageUrl,
            quantity: quantity,
        } as any);
        message.success('Đã thêm vào giỏ hàng!');
    };

    if (!product) return <div className="container">Loading...</div>;

    // Lấy danh sách ảnh từ originalData
    const images = product.originalData?.product_image?.map(i => i.image_url) || [product.imageUrl];

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <section className="product-detail">
                <div className="product-detail__gallery">
                    <img
                        src={images[0]}
                        alt={product.name}
                        className="main-image"
                        style={{ width: '100%', borderRadius: 8 }}
                    />
                </div>

                <div className="product-detail__info">
                    <h1 className="product-detail__title">{product.name}</h1>

                    <div className="product-detail__price-container">
                        {/* Hiển thị giá của Variant đang chọn */}
                        <p className="product-detail__price">
                            {selectedVariant
                                ? selectedVariant.price.toLocaleString('vi-VN')
                                : product.price.toLocaleString('vi-VN')}
                            ₫
                        </p>
                    </div>

                    {/* Chọn Variant nếu có */}
                    {product.originalData?.product_variants &&
                        product.originalData.product_variants.length > 0 && (
                            <div style={{ marginBottom: 20 }}>
                                <strong>Phân loại: </strong>
                                <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                                    {product.originalData.product_variants.map((v: any) => (
                                        <Button
                                            key={v.id}
                                            type={
                                                selectedVariant?.id === v.id ? 'primary' : 'default'
                                            }
                                            onClick={() => setSelectedVariant(v)}
                                        >
                                            {v.color} {v.storage} - {v.price.toLocaleString()}đ
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}

                    <div className="product-detail__quantity">
                        <div className="quantity-selector">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                                -
                            </button>
                            <input value={quantity} readOnly />
                            <button onClick={() => setQuantity(quantity + 1)}>+</button>
                        </div>
                    </div>

                    <Button type="primary" size="large" onClick={handleAddToCart}>
                        Thêm vào giỏ hàng
                    </Button>

                    <div className="product-detail__description">
                        <p>{product.description}</p>
                    </div>
                </div>
            </section>

            {/* Giữ nguyên phần Tabs đánh giá và Related Products */}
        </div>
    );
};

export default ProductDetailPage;
