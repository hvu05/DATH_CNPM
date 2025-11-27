// FE/src/components/common/ProductCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.scss';

// Props khớp với interface Product đã map
interface ProductCardProps {
    id: number | string;
    name: string;
    price: number;
    imageUrl: string;
    [key: string]: any; // Cho phép các props thừa khác
}

const ProductCard: React.FC<ProductCardProps> = ({ id, name, price, imageUrl }) => {
    return (
        <div className="product-card">
            <Link to={`/product/${id}`}>
                <div className="product-card__image-wrapper">
                    <img src={imageUrl} alt={name} className="product-card__image" />
                </div>
                <div className="product-card__info">
                    <h3 className="product-card__name">{name}</h3>
                    <p className="product-card__price">
                        {price ? price.toLocaleString('vi-VN') : 'Liên hệ'}₫
                    </p>
                </div>
            </Link>
        </div>
    );
};
export default ProductCard;
