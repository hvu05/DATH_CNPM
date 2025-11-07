import React from "react";
import { Link } from "react-router-dom";
import "./ProductCard.scss";

interface ProductCardProps {
  id: number | string;
  name: string;
  price: number;
  imageUrl: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  imageUrl,
}) => {
  return (
    <div className="product-card">
      <Link to={`/product/${id}`}>
        <img src={imageUrl} alt={name} className="product-card__image" />
        <div className="product-card__info">
          <h3 className="product-card__name">{name}</h3>
          <p className="product-card__price">
            {price.toLocaleString("vi-VN")}₫
          </p>
        </div>
      </Link>
    </div>
  );
};
export default ProductCard;
