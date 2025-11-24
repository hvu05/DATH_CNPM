import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.scss';

interface ProductCardProps {
    id: number | string;
    name: string;
    price: number;
    imageUrl?: string; // made optional to accept API shape
}

const ProductCard: React.FC<ProductCardProps> = ({ id, name, price, imageUrl }) => {
    const src = imageUrl ?? '/placeholder.png'; // provide fallback for missing images
    return (
        <div className="product-card">
            <Link to={`/product/${id}`}>
                <img src={src} alt={name} className="product-card__image" />
                <div className="product-card__info">
                    <h3 className="product-card__name">{name}</h3>
                    <p className="product-card__price">{price.toLocaleString('vi-VN')}₫</p>
                </div>
            </Link>
        </div>
    );
};
export default ProductCard;
