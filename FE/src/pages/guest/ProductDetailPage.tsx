import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, getProducts } from '@/services/productsApi';
import type { Product, BackendVariant } from '@/types/product';
import { useCart } from '@/contexts/CartContext';
import { useAuthContext } from '@/contexts/AuthContext';
import { Button, message, Rate, Tabs, Avatar, Divider, Tag, Skeleton, Form, Input } from 'antd';
import {
    UserOutlined,
    ShoppingCartOutlined,
    ThunderboltOutlined,
    CheckCircleOutlined,
    CarOutlined,
    SyncOutlined,
} from '@ant-design/icons';
import ProductCard from '@/components/common/ProductCard';
import './ProductDetailPage.scss';

const { TextArea } = Input;

// Định nghĩa Interface cho Review Local
interface LocalReview {
    id: number | string;
    user: string;
    rating: number;
    comment: string;
    date: string;
    avatar?: string;
}

// Dữ liệu đánh giá mẫu
const MOCK_REVIEWS: LocalReview[] = [
    {
        id: 1,
        user: 'Nguyễn Văn A',
        rating: 5,
        comment: 'Sản phẩm rất đẹp, giao hàng nhanh!',
        date: '2023-11-20',
    },
    {
        id: 2,
        user: 'Trần Thị B',
        rating: 4,
        comment: 'Chất lượng ổn trong tầm giá.',
        date: '2023-11-22',
    },
];

const ProductDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addToCart, cartItems } = useCart();
    const { isLoggedIn } = useAuthContext(); // <--- 2. Lấy biến isLoggedIn

    const [reviewForm] = Form.useForm();

    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [selectedVariant, setSelectedVariant] = useState<BackendVariant | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [activeTab, setActiveTab] = useState('1');

    const [reviews, setReviews] = useState<LocalReview[]>([]);

    useEffect(() => {
        if (id) {
            const savedReviews = localStorage.getItem(`reviews_product_${id}`);
            if (savedReviews) {
                setReviews(JSON.parse(savedReviews));
            } else {
                setReviews(MOCK_REVIEWS);
            }
        }
    }, [id]);

    const handleSubmitReview = (values: any) => {
        const newReview: LocalReview = {
            id: Date.now(),
            user: 'Khách hàng',
            rating: values.rating,
            comment: values.comment,
            date: new Date().toLocaleDateString('vi-VN'),
        };
        const newList = [newReview, ...reviews];
        setReviews(newList);
        if (id) localStorage.setItem(`reviews_product_${id}`, JSON.stringify(newList));

        reviewForm.resetFields();
        message.success('Cảm ơn bạn đã đánh giá sản phẩm!');
    };

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
                if (data) {
                    getProducts().then(all =>
                        setRelatedProducts(all.filter(p => p.id !== data.id).slice(0, 4))
                    );
                }
            });
            window.scrollTo(0, 0);
        }
    }, [id]);

    const displayPrice = selectedVariant ? Number(selectedVariant.price) : product?.price || 0;
    const stock = selectedVariant ? selectedVariant.quantity : product?.quantity || 0;
    const isOutOfStock = stock <= 0;

    const avgRating =
        reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 5;

    const handleQuantityChange = (val: number) => {
        if (val < 1) val = 1;
        if (val > stock) val = stock;
        setQuantity(val);
    };

    const handleAddToCart = async (isBuyNow = false) => {
        if (!product) return;
        if (stock <= 0) {
            message.error('Sản phẩm này đang tạm hết hàng');
            return;
        }

        const finalVariantId = selectedVariant?.id || product.id;
        const finalQty = quantity;

        const images = product.originalImages?.length
            ? product.originalImages.map(i => i.image_url)
            : [product.imageUrl];
        const currentImage = images[selectedImageIndex] || product.imageUrl;

        const itemData = {
            productId: Number(product.id),
            variantId: finalVariantId,
            name: `${product.name} ${selectedVariant ? `(${selectedVariant.color} - ${selectedVariant.storage})` : ''}`,
            price: displayPrice,
            imageUrl: currentImage,
            quantity: finalQty,
        };

        if (isBuyNow) {
            // --- 3. LOGIC MỚI CHO NÚT MUA NGAY ---
            if (isLoggedIn) {
                const total = displayPrice * finalQty;
                navigate('/client/order', {
                    state: {
                        orderItems: [itemData],
                        total: total,
                    },
                });
            } else {
                await addToCart(itemData);
                message.info(
                    'Vui lòng đăng nhập để thanh toán. Sản phẩm đã được thêm vào giỏ hàng.'
                );
                navigate('/cart');
            }
        } else {
            // === LOGIC THÊM VÀO GIỎ THƯỜNG ===
            const cartItem = cartItems.find(
                i => i.variantId === finalVariantId && i.productId === Number(product.id)
            );

            const existingQty = cartItem ? cartItem.quantity : 0;

            if (existingQty + finalQty > stock) {
                message.error(
                    `Bạn đã có ${existingQty} sản phẩm trong giỏ. Tồn kho chỉ còn ${stock}.`
                );
                return;
            }

            await addToCart(itemData);
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

                    <div className="product-detail__rating">
                        <Rate disabled allowHalf value={avgRating} />
                        <span className="product-detail__rating-text">
                            {avgRating.toFixed(1)} ({reviews.length} đánh giá)
                        </span>
                    </div>

                    <div className="product-detail__price-container">
                        <p className="product-detail__price">
                            {displayPrice > 0
                                ? `${displayPrice.toLocaleString('vi-VN')}₫`
                                : 'Liên hệ'}
                        </p>
                        {displayPrice > 0 && (
                            <>
                                <p className="product-detail__original-price">
                                    {(displayPrice * 1.1).toLocaleString('vi-VN')}₫
                                </p>
                                <span className="product-detail__discount">-10%</span>
                            </>
                        )}
                        {isOutOfStock && <Tag color="red">HẾT HÀNG</Tag>}
                    </div>

                    {/* HARDCODE CHÍNH SÁCH */}
                    <div className="product-detail__policies">
                        <div className="policy-item">
                            <CheckCircleOutlined style={{ color: '#52c41a' }} />
                            <span>Bảo hành chính hãng 12 tháng</span>
                        </div>
                        <div className="policy-item">
                            <CarOutlined style={{ color: '#1890ff' }} />
                            <span>Miễn phí vận chuyển toàn quốc</span>
                        </div>
                        <div className="policy-item">
                            <SyncOutlined style={{ color: '#faad14' }} />
                            <span>Đổi trả trong 30 ngày lỗi NSX</span>
                        </div>
                    </div>

                    {/* BIẾN THỂ (VARIANTS) */}
                    {product.originalVariants && product.originalVariants.length > 0 && (
                        <div style={{ marginBottom: 20 }}>
                            <p style={{ fontWeight: 600, marginBottom: 8 }}>Phiên bản:</p>
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

                    {/* SỐ LƯỢNG */}
                    <div className="product-detail__quantity">
                        <span>Số lượng:</span>
                        <div className="quantity-selector">
                            <button
                                className="quantity-btn"
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
                                className="quantity-btn"
                                onClick={() => handleQuantityChange(quantity + 1)}
                                disabled={isOutOfStock}
                            >
                                +
                            </button>
                        </div>
                        <span style={{ marginLeft: 10, color: '#888', fontSize: 13 }}>
                            {isOutOfStock ? 'Hết hàng' : `Còn ${stock} sản phẩm`}
                        </span>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="product-detail__actions">
                        <Button
                            type="primary"
                            ghost
                            size="large"
                            icon={<ShoppingCartOutlined />}
                            onClick={() => handleAddToCart(false)}
                            disabled={isOutOfStock}
                            style={{ height: 48, fontSize: 16 }}
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
                            style={{ height: 48, fontSize: 16 }}
                        >
                            Mua ngay
                        </Button>
                    </div>
                </div>
            </section>

            {/* TABS: MÔ TẢ & ĐÁNH GIÁ */}
            <section className="product-tabs">
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={[
                        {
                            key: '1',
                            label: 'Mô tả chi tiết',
                            children: (
                                <div
                                    className="product-description"
                                    style={{ whiteSpace: 'pre-line' }}
                                >
                                    <h3>Thông tin sản phẩm</h3>
                                    <p>
                                        {product.description ||
                                            'Đang cập nhật mô tả cho sản phẩm này.'}
                                    </p>
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
                                                {avgRating.toFixed(1)}/5
                                            </span>
                                            <Rate disabled allowHalf value={avgRating} />
                                        </div>
                                    </div>

                                    <Divider />

                                    {/* FORM VIẾT ĐÁNH GIÁ */}
                                    <div className="review-form">
                                        <h3>Viết đánh giá của bạn</h3>
                                        <Form
                                            form={reviewForm}
                                            onFinish={handleSubmitReview}
                                            layout="vertical"
                                        >
                                            <Form.Item
                                                name="rating"
                                                label="Đánh giá sao"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Vui lòng chọn số sao!',
                                                    },
                                                ]}
                                            >
                                                <Rate />
                                            </Form.Item>
                                            <Form.Item
                                                name="comment"
                                                label="Nội dung"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Vui lòng nhập nội dung!',
                                                    },
                                                ]}
                                            >
                                                <TextArea
                                                    rows={3}
                                                    placeholder="Sản phẩm dùng thế nào?"
                                                />
                                            </Form.Item>
                                            <Button type="primary" htmlType="submit">
                                                Gửi đánh giá
                                            </Button>
                                        </Form>
                                    </div>

                                    <Divider />

                                    {/* LIST ĐÁNH GIÁ */}
                                    <div className="review-list">
                                        {reviews.length === 0 && <p>Chưa có đánh giá nào.</p>}
                                        {reviews.map((r, i) => (
                                            <div key={i} className="review-item">
                                                <div className="review-header">
                                                    <Avatar
                                                        icon={<UserOutlined />}
                                                        src={r.avatar}
                                                    />
                                                    <div className="review-info">
                                                        <div className="review-user">{r.user}</div>
                                                        <div className="review-date">{r.date}</div>
                                                    </div>
                                                    <Rate
                                                        disabled
                                                        value={r.rating}
                                                        style={{ fontSize: 14 }}
                                                    />
                                                </div>
                                                <div className="review-content">{r.comment}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ),
                        },
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
