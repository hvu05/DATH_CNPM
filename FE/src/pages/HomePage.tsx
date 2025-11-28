// FE/src/pages/HomePage.tsx
import React, { useRef, useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getProducts } from '@/services/productsApi';
import type { Product } from '@/types/product';
import ProductCard from '@/components/common/ProductCard';
import BannerSlider from '@/components/common/BannerSlider';
import './HomePage.scss';

const HomePage: React.FC = () => {
    const [productsList, setProductsList] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const fetchData = async () => {
            const data = await getProducts();
            setProductsList(data);
            setLoading(false);
        };
        fetchData();
    }, []);

    const pageParam = parseInt(searchParams.get('page') || '1', 10);
    const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
    const pageSize = 20; // 20 sản phẩm mỗi trang
    const totalPages = Math.max(1, Math.ceil(productsList.length / pageSize));
    const start = (page - 1) * pageSize;
    const pagedProducts = productsList.slice(start, start + pageSize);
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    const carouselRef = useRef<HTMLDivElement | null>(null);
    const scrollByCard = (dir: 'left' | 'right') => {
        const el = carouselRef.current;
        if (!el) return;
        const amount = 300;
        el.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' });
    };

    const topPicks = productsList.slice(0, 8);

    if (loading)
        return (
            <div className="container" style={{ padding: '50px' }}>
                Đang tải sản phẩm...
            </div>
        );

    return (
        <div className="homepage-wrapper">
            <div className="container">
                {/* 1. SLIDER CHÍNH */}
                <section className="banner-section">
                    <BannerSlider
                        banners={[
                            {
                                id: 1,
                                title: 'iPhone 15',
                                image: 'https://placehold.co/1200x300.png?text=iPhone+15+Promo',
                                link: '/search?q=iphone',
                            },
                            {
                                id: 2,
                                title: 'Laptop',
                                image: 'https://placehold.co/1200x300.png?text=Laptop+Super+Sale',
                                link: '/search?q=laptop',
                            },
                            {
                                id: 3,
                                title: 'Summer',
                                image: 'https://placehold.co/1200x300.png?text=Summer+Vibes',
                                link: '/search?q=watch',
                            },
                        ]}
                    />
                </section>

                {/* 2. BANNER NHỎ (Đã khôi phục) */}
                <section className="small-banners-section">
                    <Link to="/search?q=samsung" className="small-banner-item">
                        <img
                            src="https://placehold.co/600x150.png?text=Samsung+Galaxy+S24"
                            alt="Banner 1"
                        />
                    </Link>
                    <Link to="/search?q=macbook" className="small-banner-item">
                        <img
                            src="https://placehold.co/600x150.png?text=Macbook+Air+M2"
                            alt="Banner 2"
                        />
                    </Link>
                </section>

                {/* 3. GỢI Ý (CAROUSEL) */}
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

                {/* 4. LƯỚI SẢN PHẨM CHÍNH + PAGINATION */}
                <section className="main-products-section">
                    <h2 className="section-title">Tất cả sản phẩm</h2>
                    <div className="product-grid">
                        {pagedProducts.map(product => (
                            <ProductCard key={product.id} {...product} />
                        ))}
                    </div>

                    <div className="pagination-wrapper">
                        <div className="pagination">
                            <Link
                                to={`?page=${Math.max(1, page - 1)}`}
                                className={`page-btn ${page === 1 ? 'disabled' : ''}`}
                            >
                                &laquo; Prev
                            </Link>
                            {pageNumbers.map(p => (
                                <Link
                                    key={p}
                                    to={`?page=${p}`}
                                    className={`page-number ${p === page ? 'active' : ''}`}
                                >
                                    {p}
                                </Link>
                            ))}
                            <Link
                                to={`?page=${Math.min(totalPages, page + 1)}`}
                                className={`page-btn ${page === totalPages ? 'disabled' : ''}`}
                            >
                                Next &raquo;
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default HomePage;
