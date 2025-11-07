// FE/src/pages/ProductDetailPage.tsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { products } from "@/services/MockData";
import { useCart } from "@/contexts/CartContext";
import {
  Button,
  message,
  Rate,
  Tabs,
  Form,
  Input,
  Avatar,
  Divider,
  Popconfirm,
} from "antd";
import ProductCard from "@/components/common/ProductCard";
import { UserOutlined, DeleteOutlined } from "@ant-design/icons";
import "./ProductDetailPage.scss";

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
  const [activeTab, setActiveTab] = useState("1");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [reviewForm] = Form.useForm();

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="container">
        <h2>Sản phẩm không tồn tại</h2>
      </div>
    );
  }

  // Reviews per-product: ưu tiên localStorage, nếu không có dùng product.reviews hoặc mảng rỗng
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem(`reviews_product_${product.id}`);
      if (saved) return JSON.parse(saved) as Review[];
    } catch {
      /* ignore parse errors */
    }
    if (product.reviews && Array.isArray(product.reviews)) {
      return product.reviews.map((r) => ({
        id: r.id,
        user: r.user,
        rating: r.rating,
        comment: r.comment,
        date: r.date,
        avatar: r.avatar ?? "",
      }));
    }
    return [];
  });

  const persistReviews = (list: Review[]) => {
    try {
      localStorage.setItem(
        `reviews_product_${product.id}`,
        JSON.stringify(list)
      );
    } catch {}
  };

  const productImages = [
    product.imageUrl,
    `https://placehold.co/600x600.png?text=${encodeURIComponent(
      product.name
    )}+Image+2`,
    `https://placehold.co/600x600.png?text=${encodeURIComponent(
      product.name
    )}+Image+3`,
    `https://placehold.co/600x600.png?text=${encodeURIComponent(
      product.name
    )}+Image+4`,
  ];

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
      });
    }
    message.success(`${product.name} đã được thêm vào giỏ hàng!`);
  };

  const handleSubmitReview = (values: any) => {
    const newReview: Review = {
      id: Date.now(),
      user: "Người dùng hiện tại",
      rating: values.rating,
      comment: values.comment,
      date: new Date().toISOString().split("T")[0],
      avatar: "",
    };
    const newList = [newReview, ...reviews];
    setReviews(newList);
    persistReviews(newList);
    reviewForm.resetFields();
    message.success("Cảm ơn bạn đã đánh giá sản phẩm!");
    setActiveTab("2");
  };

  // Xóa review theo id, cập nhật state và localStorage
  {
    /*const removeReview = (reviewId: number | string) => {
    const newList = reviews.filter((r) => r.id !== reviewId);
    setReviews(newList);
    persistReviews(newList);
    message.success("Đã xóa đánh giá.");
  };*/
  }

  const relatedProducts = products
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.brand === product.brand ||
          p.category === product.category ||
          p.name.includes(product.brand || ""))
    )
    .slice(0, 4);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <div className="container" style={{ padding: "2rem 0" }}>
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
                className={`thumbnail ${
                  selectedImageIndex === index ? "active" : ""
                }`}
                onClick={() => setSelectedImageIndex(index)}
              />
            ))}
          </div>
        </div>

        <div className="product-detail__info">
          <h1 className="product-detail__title">{product.name}</h1>

          <div className="product-detail__rating">
            <Rate
              disabled
              value={Number.isFinite(averageRating) ? averageRating : 0}
            />
            <span className="product-detail__rating-text">
              {Number.isFinite(averageRating)
                ? averageRating.toFixed(1)
                : "0.0"}{" "}
              ({reviews.length} đánh giá)
            </span>
          </div>

          <div className="product-detail__price-container">
            <p className="product-detail__price">
              {product.price.toLocaleString("vi-VN")}₫
            </p>
            <p className="product-detail__original-price">
              {(product.price * 1.2).toLocaleString("vi-VN")}₫
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
                min="1"
                onChange={(e) =>
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
            <p>{product.description ?? "Chưa có mô tả cho sản phẩm này."}</p>
          </div>
        </div>
      </section>

      <section className="product-tabs">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: "1",
              label: "Mô tả chi tiết",
              children: (
                <div className="product-description">
                  <h3>Thông số kỹ thuật</h3>
                  <ul>
                    {(product.specs && product.specs.length > 0
                      ? product.specs
                      : ["Chưa có thông số kỹ thuật"]
                    ).map((spec, idx) => (
                      <li key={idx}>{spec}</li>
                    ))}
                  </ul>
                </div>
              ),
            },
            {
              key: "2",
              label: `Đánh giá (${reviews.length})`,
              children: (
                <div className="product-reviews">
                  <div className="review-summary">
                    <div className="review-summary__rating">
                      <span className="review-summary__score">
                        {Number.isFinite(averageRating)
                          ? averageRating.toFixed(1)
                          : "0.0"}
                      </span>
                      <Rate
                        disabled
                        value={
                          Number.isFinite(averageRating) ? averageRating : 0
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
                            message: "Vui lòng chọn đánh giá!",
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
                            message: "Vui lòng nhập bình luận!",
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
                        Chưa có đánh giá nào. Hãy là người đầu tiên nhận xét!
                      </p>
                    )}
                    {reviews.map((review) => (
                      <div key={review.id} className="review-item">
                        <div className="review-header">
                          <Avatar src={review.avatar} icon={<UserOutlined />} />
                          <div className="review-info">
                            <div className="review-user">{review.user}</div>
                            <div className="review-date">{review.date}</div>
                          </div>
                          <Rate disabled value={review.rating} />
                          {/* nút xóa ở cạnh phải */}
                          {/*<Popconfirm
                            title="Xác nhận xóa đánh giá này?"
                            onConfirm={() => removeReview(review.id)}
                            okText="Xóa"
                            cancelText="Hủy"
                          >
                            <Button
                              type="text"
                              danger
                              icon={<DeleteOutlined />}
                            />
                          </Popconfirm> */}
                        </div>
                        <div className="review-content">{review.comment}</div>
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
          {relatedProducts.map((rp) => (
            <ProductCard key={rp.id} {...rp} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductDetailPage;
