// FE/src/pages/HomePage.tsx
import React, { useRef, useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getProducts } from '@/services/productsApi'; // Dùng API thật
import type { Product } from '@/types/product';
import ProductCard from '@/components/common/ProductCard';
import BannerSlider from '@/components/common/BannerSlider';
import './HomePage.scss';

const HomePage: React.FC = () => {
    const [productsList, setProductsList] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // --- GỌI API ---
    useEffect(() => {
        const fetchData = async () => {
            const data = await getProducts();
            setProductsList(data);
            setLoading(false);
        };
        fetchData();
    }, []);

    // Logic Carousel cũ
    const carouselRef = useRef<HTMLDivElement | null>(null);
    const scrollByCard = (dir: 'left' | 'right') => {
        const el = carouselRef.current;
        if (!el) return;
        const amount = 240; // Card width + gap
        el.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' });
    };

    const [searchParams] = useSearchParams();
    const pageParam = parseInt(searchParams.get('page') || '1', 10);
    const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;

    const pageSize = 20;
    // Cắt trang trên Client (nếu BE chưa hỗ trợ phân trang)
    const totalPages = Math.max(1, Math.ceil(productsList.length / pageSize));
    const start = (page - 1) * pageSize;
    const pagedProducts = productsList.slice(start, start + pageSize);

    const topPicks = productsList.slice(0, 8); // Lấy 8 sản phẩm đầu làm gợi ý

    if (loading)
        return (
            <div className="container" style={{ padding: '50px' }}>
                Đang tải sản phẩm...
            </div>
        );

    return (
        <div className="homepage-wrapper">
            <div className="container">
                {/* KHU VỰC 1: BANNER */}
                <section className="banner-section">
                    <BannerSlider
                        banners={[
                            {
                                id: 1,
                                title: 'iPhone 15',
                                image: 'https://placehold.co/1200x300.png?text=iPhone+15',
                                link: '/search?q=iphone',
                            },
                            {
                                id: 2,
                                title: 'Laptop',
                                image: 'https://placehold.co/1200x300.png?text=Laptop+Sale',
                                link: '/search?q=laptop',
                            },
                        ]}
                    />
                </section>

                {/* KHU VỰC 3: GỢI Ý */}
                <section className="suggestion-section">
                    <h2 className="section-title">Gợi ý cho bạn</h2>
                    <div className="carousel-wrapper">
                        <button
                            className="carousel-btn btn-prev"
                            onClick={() => scrollByCard('left')}
                        >
                            ‹
                        </button>
                        <div className="suggestion-carousel" ref={carouselRef}>
                            {topPicks.map(product => (
                                <ProductCard key={product.id} {...product} />
                            ))}
                        </div>
                        <button
                            className="carousel-btn btn-next"
                            onClick={() => scrollByCard('right')}
                        >
                            ›
                        </button>
                    </div>
                </section>

                {/* KHU VỰC 4: DANH SÁCH SẢN PHẨM */}
                <section className="main-products-section">
                    <h2 className="section-title">Tất cả sản phẩm</h2>
                    <div className="product-grid">
                        {pagedProducts.map(product => (
                            <ProductCard key={product.id} {...product} />
                        ))}
                    </div>
                    {/* Pagination giữ nguyên */}
                </section>
            </div>
        </div>
    );
};

export default HomePage;
