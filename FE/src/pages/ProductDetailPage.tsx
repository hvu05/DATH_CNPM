// FE/src/pages/ProductDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button, message, Rate, Tabs, Form, Input, Avatar, Divider } from 'antd';
import ProductCard from '@/components/common/ProductCard';
import { UserOutlined } from '@ant-design/icons';
import './ProductDetailPage.scss';
import { getProductById, getProducts } from '@/services/productsApi';
import type { Product } from '@/services/productsApi';

const { TextArea } = Input;

interface Review {
    id: number | string;
    user: string;
    rating: number;
    comment: string;
    date: string;
    avatar?: string;
}

const ProductDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('1');
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [reviewForm] = Form.useForm();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
        if (!id) return;
        let mounted = true;
        getProductById(id)
            .then(p => {
                if (mounted) setProduct(p);
            })
            .finally(() => mounted && setLoading(false));
        return () => {
            mounted = false;
        };
    }, [id]);

    // load all products once (used for related products)
    useEffect(() => {
        let mounted = true;
        getProducts()
            .then(list => {
                if (mounted) setAllProducts(list);
            })
            .catch(() => {
                if (mounted) setAllProducts([]);
            });
        return () => {
            mounted = false;
        };
    }, []);

    // initialize or restore reviews whenever product changes
    useEffect(() => {
        if (!product) {
            setReviews([]);
            return;
        }
        try {
            const saved = localStorage.getItem(`reviews_product_${String(product.id)}`);
            if (saved) {
                setReviews(JSON.parse(saved) as Review[]);
                return;
            }
        } catch {
            // ignore parse errors
        }

        if (product.reviews && Array.isArray(product.reviews)) {
            setReviews(
                product.reviews.map((r: any) => ({
                    id: r.id,
                    user: r.user,
                    rating: r.rating,
                    comment: r.comment,
                    date: r.date,
                    avatar: r.avatar ?? '',
                }))
            );
        } else {
            setReviews([]);
        }
    }, [product]);

    const persistReviews = (list: Review[]) => {
        try {
            localStorage.setItem(
                `reviews_product_${String(product?.id ?? '')}`,
                JSON.stringify(list)
            );
        } catch {}
    };

    if (loading) return <div className="container">Đang tải...</div>;
    if (!product) {
        return (
            <div className="container">
                <h2>Sản phẩm không tồn tại</h2>
            </div>
        );
    }

    const productImages = [
        product.imageUrl ??
            `https://placehold.co/600x600.png?text=${encodeURIComponent(product.name ?? 'Product')}`,
        `https://placehold.co/600x600.png?text=${encodeURIComponent(product.name ?? 'Product')}+Image+2`,
        `https://placehold.co/600x600.png?text=${encodeURIComponent(product.name ?? 'Product')}+Image+3`,
        `https://placehold.co/600x600.png?text=${encodeURIComponent(product.name ?? 'Product')}+Image+4`,
    ];

    const handleAddToCart = () => {
        // prefer single call if CartContext supports quantity, otherwise add multiple times
        for (let i = 0; i < quantity; i++) {
            addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl ?? '',
            });
        }
        message.success(`${product.name} đã được thêm vào giỏ hàng!`);
    };

    const handleSubmitReview = (values: any) => {
        const newReview: Review = {
            id: Date.now(),
            user: 'Người dùng hiện tại',
            rating: values.rating,
            comment: values.comment,
            date: new Date().toISOString().split('T')[0],
            avatar: '',
        };
        const newList = [newReview, ...reviews];
        setReviews(newList);
        persistReviews(newList);
        reviewForm.resetFields();
        message.success('Cảm ơn bạn đã đánh giá sản phẩm!');
        setActiveTab('2');
    };

    // related products computed from allProducts (exclude current)
    const relatedProducts = allProducts
        .filter((p: Product) => {
            return (
                p.id !== product.id &&
                (p.brand === product.brand ||
                    p.category === product.category ||
                    (product.brand && p.name.includes(product.brand)))
            );
        })
        .slice(0, 4);

    const averageRating =
        reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <section className="product-detail">
                <div className="product-detail__gallery">
                    <div className="main-image-container">
                        <img
                            src={productImages[selectedImageIndex]}
                            alt={product.name}
                            className="main-image"
                        />
                    </div>
                    <div className="thumbnail-container">
                        {productImages.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`${product.name} ${index + 1}`}
                                className={`thumbnail ${selectedImageIndex === index ? 'active' : ''}`}
                                onClick={() => setSelectedImageIndex(index)}
                            />
                        ))}
                    </div>
                </div>

                <div className="product-detail__info">
                    <h1 className="product-detail__title">{product.name}</h1>

                    <div className="product-detail__rating">
                        <Rate disabled value={Number.isFinite(averageRating) ? averageRating : 0} />
                        <span className="product-detail__rating-text">
                            {Number.isFinite(averageRating) ? averageRating.toFixed(1) : '0.0'} (
                            {reviews.length} đánh giá)
                        </span>
                    </div>

                    <div className="product-detail__price-container">
                        <p className="product-detail__price">
                            {product.price.toLocaleString('vi-VN')}₫
                        </p>
                        <p className="product-detail__original-price">
                            {(product.price * 1.2).toLocaleString('vi-VN')}₫
                        </p>
                        <span className="product-detail__discount">-20%</span>
                    </div>

                    <div className="product-detail__policies">
                        <div className="policy-item">
                            <span className="policy-icon">✓</span>
                            <span>Bảo hành chính hãng</span>
                        </div>
                        <div className="policy-item">
                            <span className="policy-icon">✓</span>
                            <span>Miễn phí vận chuyển</span>
                        </div>
                        <div className="policy-item">
                            <span className="policy-icon">✓</span>
                            <span>Đổi trả trong 30 ngày</span>
                        </div>
                    </div>

                    <div className="product-detail__quantity">
                        <span>Số lượng:</span>
                        <div className="quantity-selector">
                            <button
                                className="quantity-btn"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            >
                                -
                            </button>
                            <input
                                type="number"
                                value={quantity}
                                min={1}
                                onChange={e =>
                                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                                }
                            />
                            <button
                                className="quantity-btn"
                                onClick={() => setQuantity(quantity + 1)}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <div className="product-detail__actions">
                        <Button type="primary" size="large" onClick={handleAddToCart}>
                            Thêm vào giỏ hàng
                        </Button>
                        <Button size="large">Mua ngay</Button>
                    </div>

                    <div className="product-detail__description">
                        <h3>Mô tả sản phẩm</h3>
                        <p>{product.description ?? 'Chưa có mô tả cho sản phẩm này.'}</p>
                    </div>
                </div>
            </section>

            <section className="product-tabs">
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={[
                        {
                            key: '1',
                            label: 'Mô tả chi tiết',
                            children: (
                                <div className="product-description">
                                    <h3>Thông số kỹ thuật</h3>
                                    <ul>
                                        {(product.specs && product.specs.length > 0
                                            ? product.specs
                                            : ['Chưa có thông số kỹ thuật']
                                        ).map((spec, idx) => (
                                            <li key={idx}>{spec}</li>
                                        ))}
                                    </ul>
                                </div>
                            ),
                        },
                        {
                            key: '2',
                            label: `Đánh giá (${reviews.length})`,
                            children: (
                                <div className="product-reviews">
                                    <div className="review-summary">
                                        <div className="review-summary__rating">
                                            <span className="review-summary__score">
                                                {Number.isFinite(averageRating)
                                                    ? averageRating.toFixed(1)
                                                    : '0.0'}
                                            </span>
                                            <Rate
                                                disabled
                                                value={
                                                    Number.isFinite(averageRating)
                                                        ? averageRating
                                                        : 0
                                                }
                                            />
                                            <span className="review-summary__count">
                                                {reviews.length} đánh giá
                                            </span>
                                        </div>
                                    </div>

                                    <Divider />

                                    <div className="review-form">
                                        <h3>Viết đánh giá của bạn</h3>
                                        <Form
                                            form={reviewForm}
                                            onFinish={handleSubmitReview}
                                            layout="vertical"
                                        >
                                            <Form.Item
                                                name="rating"
                                                label="Đánh giá"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Vui lòng chọn đánh giá!',
                                                    },
                                                ]}
                                            >
                                                <Rate />
                                            </Form.Item>
                                            <Form.Item
                                                name="comment"
                                                label="Bình luận"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Vui lòng nhập bình luận!',
                                                    },
                                                ]}
                                            >
                                                <TextArea
                                                    rows={4}
                                                    placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                                                />
                                            </Form.Item>
                                            <Form.Item>
                                                <Button type="primary" htmlType="submit">
                                                    Gửi đánh giá
                                                </Button>
                                            </Form.Item>
                                        </Form>
                                    </div>

                                    <Divider />

                                    <div className="review-list">
                                        {reviews.length === 0 && (
                                            <p>
                                                Chưa có đánh giá nào. Hãy là người đầu tiên nhận
                                                xét!
                                            </p>
                                        )}
                                        {reviews.map(review => (
                                            <div key={review.id} className="review-item">
                                                <div className="review-header">
                                                    <Avatar
                                                        src={review.avatar}
                                                        icon={<UserOutlined />}
                                                    />
                                                    <div className="review-info">
                                                        <div className="review-user">
                                                            {review.user}
                                                        </div>
                                                        <div className="review-date">
                                                            {review.date}
                                                        </div>
                                                    </div>
                                                    <Rate disabled value={review.rating} />
                                                </div>
                                                <div className="review-content">
                                                    {review.comment}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ),
                        },
                    ]}
                />
            </section>

            <section className="related-products">
                <h2 className="section-title">Sản phẩm liên quan</h2>
                <div className="product-grid">
                    {relatedProducts.map((rp: Product) => (
                        <ProductCard
                            key={rp.id}
                            id={rp.id}
                            name={rp.name}
                            price={rp.price}
                            imageUrl={rp.imageUrl ?? '/placeholder.png'}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default ProductDetailPage;
