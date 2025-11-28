// FE/src/pages/ProductDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    getProductById,
    getProducts,
    getProductReviews,
    createProductReview,
} from '@/services/productsApi';
import type { Product, BackendVariant, BackendReview } from '@/types/product';
import { useCart } from '@/contexts/CartContext';
import {
    Button,
    message,
    Rate,
    Tabs,
    Avatar,
    Divider,
    Form,
    Input,
    Empty,
    List,
    Skeleton,
} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import ProductCard from '@/components/common/ProductCard';
import './ProductDetailPage.scss';

const { TextArea } = Input;

const ProductDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { addToCart } = useCart();

    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

    const [reviews, setReviews] = useState<BackendReview[]>([]);
    const [loadingReviews, setLoadingReviews] = useState(false);

    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState<BackendVariant | null>(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const [form] = Form.useForm();

    useEffect(() => {
        if (id) {
            getProductById(id).then(data => {
                setProduct(data);
                if (data?.originalVariants && data.originalVariants.length > 0) {
                    const sorted = [...data.originalVariants].sort(
                        (a, b) => Number(a.price) - Number(b.price)
                    );
                    setSelectedVariant(sorted[0]);
                }
                getProducts().then(all => {
                    setRelatedProducts(
                        all
                            .filter(p => p.category === data?.category && p.id !== data?.id)
                            .slice(0, 4)
                    );
                });
            });

            fetchReviews(id);
        }
    }, [id]);

    const fetchReviews = async (productId: string | number) => {
        setLoadingReviews(true);
        const data = await getProductReviews(productId);
        setReviews(data);
        setLoadingReviews(false);
    };

    const handleAddToCart = () => {
        if (!product) return;
        if (product.originalVariants && product.originalVariants.length > 0 && !selectedVariant) {
            message.error('Vui lòng chọn phiên bản màu sắc/dung lượng');
            return;
        }

        const variantSuffix = selectedVariant
            ? `(${selectedVariant.color} ${selectedVariant.storage})`
            : '';
        const finalName = `${product.name} ${variantSuffix}`;
        const finalPrice = selectedVariant ? Number(selectedVariant.price) : product.price;
        const finalId = selectedVariant ? selectedVariant.id : product.id;

        addToCart({
            productId: Number(product.id),
            variantId: finalId,
            name: finalName,
            price: finalPrice,
            imageUrl: product.imageUrl,
            quantity: quantity,
        });
        message.success('Đã thêm vào giỏ hàng!');
    };

    const handleSubmitReview = async (values: any) => {
        if (!id) return;

        const success = await createProductReview(id, {
            comment: values.comment,
            vote: values.rating,
        });

        if (success) {
            message.success('Cảm ơn bạn đã đánh giá!');
            form.resetFields();
            fetchReviews(id);
        } else {
            message.error('Gửi đánh giá thất bại. Vui lòng đăng nhập hoặc thử lại sau.');
        }
    };

    if (!product)
        return (
            <div className="container" style={{ padding: 50 }}>
                <Skeleton active />
            </div>
        );

    const images = product.originalImages?.map(i => i.image_url) || [product.imageUrl];
    const displayPrice = selectedVariant ? Number(selectedVariant.price) : product.price;

    const avgRating =
        reviews.length > 0
            ? reviews.reduce((acc, curr) => acc + curr.vote, 0) / reviews.length
            : product.rating || 5;

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <section className="product-detail">
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

                <div className="product-detail__info">
                    <h1 className="product-detail__title">{product.name}</h1>
                    <div className="product-detail__rating">
                        <Rate disabled allowHalf value={avgRating} />
                        <span className="product-detail__rating-text">
                            ({reviews.length} đánh giá)
                        </span>
                    </div>

                    <div className="product-detail__price-container">
                        <p className="product-detail__price">
                            {displayPrice.toLocaleString('vi-VN')}₫
                        </p>
                    </div>

                    {/* Variant Selector */}
                    {product.originalVariants && product.originalVariants.length > 0 && (
                        <div style={{ marginBottom: 20 }}>
                            <p style={{ fontWeight: 600, marginBottom: 8 }}>Phiên bản:</p>
                            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                {product.originalVariants.map(v => (
                                    <Button
                                        key={v.id}
                                        type={selectedVariant?.id === v.id ? 'primary' : 'default'}
                                        onClick={() => setSelectedVariant(v)}
                                    >
                                        {v.color} {v.storage} - {Number(v.price).toLocaleString()}đ
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

                    <div className="product-detail__actions">
                        <Button type="primary" size="large" onClick={handleAddToCart}>
                            Thêm vào giỏ hàng
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
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: product.description || 'Đang cập nhật',
                                    }}
                                    style={{ lineHeight: 1.6 }}
                                />
                            ),
                        },
                        {
                            key: '2',
                            label: `Đánh giá (${reviews.length})`,
                            children: (
                                <div className="product-reviews">
                                    {/* Form đánh giá */}
                                    <div style={{ maxWidth: 600, marginBottom: 30 }}>
                                        <h3>Viết đánh giá của bạn</h3>
                                        <Form
                                            form={form}
                                            onFinish={handleSubmitReview}
                                            layout="vertical"
                                        >
                                            <Form.Item
                                                name="rating"
                                                label="Mức độ hài lòng"
                                                initialValue={5}
                                            >
                                                <Rate />
                                            </Form.Item>
                                            <Form.Item
                                                name="comment"
                                                label="Nội dung đánh giá"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Vui lòng nhập nội dung',
                                                    },
                                                ]}
                                            >
                                                <TextArea
                                                    rows={3}
                                                    placeholder="Chia sẻ cảm nhận về sản phẩm..."
                                                />
                                            </Form.Item>
                                            <Button htmlType="submit" type="primary">
                                                Gửi đánh giá
                                            </Button>
                                        </Form>
                                    </div>

                                    <Divider />

                                    {/* Danh sách đánh giá */}
                                    {loadingReviews ? (
                                        <Skeleton active />
                                    ) : reviews.length > 0 ? (
                                        <List
                                            itemLayout="vertical"
                                            dataSource={reviews}
                                            renderItem={item => (
                                                <List.Item>
                                                    <List.Item.Meta
                                                        avatar={
                                                            <Avatar
                                                                src={item.user?.avatar}
                                                                icon={<UserOutlined />}
                                                            />
                                                        }
                                                        title={
                                                            <div
                                                                style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: 10,
                                                                }}
                                                            >
                                                                <span style={{ fontWeight: 600 }}>
                                                                    {item.user?.full_name ||
                                                                        'Người dùng'}
                                                                </span>
                                                                <Rate
                                                                    disabled
                                                                    value={item.vote}
                                                                    style={{ fontSize: 12 }}
                                                                />
                                                            </div>
                                                        }
                                                        description={
                                                            <div>
                                                                <div
                                                                    style={{
                                                                        color: '#333',
                                                                        marginTop: 5,
                                                                    }}
                                                                >
                                                                    {item.comment}
                                                                </div>
                                                                <div
                                                                    style={{
                                                                        fontSize: 12,
                                                                        color: '#999',
                                                                        marginTop: 4,
                                                                    }}
                                                                >
                                                                    {item.create_at
                                                                        ? new Date(
                                                                              item.create_at
                                                                          ).toLocaleDateString(
                                                                              'vi-VN'
                                                                          )
                                                                        : ''}
                                                                </div>
                                                            </div>
                                                        }
                                                    />

                                                    {item.children_reviews &&
                                                        item.children_reviews.length > 0 && (
                                                            <div
                                                                style={{
                                                                    marginLeft: 48,
                                                                    marginTop: 10,
                                                                    background: '#f9f9f9',
                                                                    padding: 12,
                                                                    borderRadius: 8,
                                                                }}
                                                            >
                                                                {item.children_reviews.map(
                                                                    (child: any) => (
                                                                        <div
                                                                            key={child.id}
                                                                            style={{
                                                                                display: 'flex',
                                                                                gap: 10,
                                                                                marginBottom: 12,
                                                                            }}
                                                                        >
                                                                            <Avatar
                                                                                size="small"
                                                                                src={
                                                                                    child.user
                                                                                        ?.avatar
                                                                                }
                                                                                icon={
                                                                                    <UserOutlined />
                                                                                }
                                                                            />
                                                                            <div>
                                                                                <div
                                                                                    style={{
                                                                                        display:
                                                                                            'flex',
                                                                                        gap: 8,
                                                                                        alignItems:
                                                                                            'center',
                                                                                    }}
                                                                                >
                                                                                    <span
                                                                                        style={{
                                                                                            fontWeight: 600,
                                                                                            fontSize: 13,
                                                                                        }}
                                                                                    >
                                                                                        {child.user
                                                                                            ?.full_name ||
                                                                                            'Admin/Staff'}
                                                                                    </span>
                                                                                </div>
                                                                                <div
                                                                                    style={{
                                                                                        fontSize: 13,
                                                                                        color: '#333',
                                                                                    }}
                                                                                >
                                                                                    {child.comment}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                        )}
                                                </List.Item>
                                            )}
                                        />
                                    ) : (
                                        <Empty description="Chưa có đánh giá nào cho sản phẩm này" />
                                    )}
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
