// FE/src/pages/CartPage.tsx
import React from "react";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";
import { Button, Empty, message, Divider } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import ProductCard from "@/components/common/ProductCard";
import { products } from "@/services/MockData";
import "./CartPage.scss";

const CartPage: React.FC = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="container cart-empty">
        <Empty description="Giỏ hàng của bạn đang trống">
          <Link to="/">
            <Button type="primary">Tiếp tục mua sắm</Button>
          </Link>
        </Empty>
      </div>
    );
  }

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleRemoveFromCart = (id: number | string) => {
    removeFromCart(id);
    message.success("Đã xóa sản phẩm khỏi giỏ hàng");
  };

  const recommendedProducts = products
    .filter((p) => !cartItems.some((item) => item.id === p.id))
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  return (
    <div className="container cart-page">
      <h1>Giỏ hàng</h1>
      <div className="cart-layout">
        <div className="cart-items-list">
          {cartItems.map((item) => (
            <div className="cart-item" key={item.id}>
              <img
                src={item.imageUrl}
                alt={item.name}
                className="cart-item__image"
              />
              <div className="cart-item__info">
                <h3 className="cart-item__name">{item.name}</h3>
                <p className="cart-item__price">
                  {item.price.toLocaleString("vi-VN")}₫
                </p>
              </div>
              <div className="cart-item__quantity">
                <input
                  type="number"
                  value={item.quantity}
                  min="1"
                  onChange={(e) =>
                    updateQuantity(item.id, Number.parseInt(e.target.value))
                  }
                />
              </div>
              <div className="cart-item__total">
                {(item.price * item.quantity).toLocaleString("vi-VN")}₫
              </div>
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleRemoveFromCart(item.id)}
              />
            </div>
          ))}
        </div>
        <div className="cart-summary">
          <h3>Thành tiền: {total.toLocaleString("vi-VN")}₫</h3>
          <Button type="primary" block size="large">
            Tiến hành đặt hàng
          </Button>
        </div>
      </div>

      <Divider />

      <section className="recommended-products">
        <h2 className="section-title">Gợi ý cho bạn</h2>
        <div className="product-grid">
          {recommendedProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default CartPage;
