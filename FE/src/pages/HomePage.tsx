// FE/src/pages/HomePage.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getProducts } from '@/services/productsApi';
import type { Product } from '@/services/productsApi';
import ProductCard from '@/components/common/ProductCard';
import BannerSlider from '@/components/common/BannerSlider';
import './HomePage.scss';

const HomePage: React.FC = () => {
    // Hooks must always run in the same order — move all hooks to top level
    const carouselRef = useRef<HTMLDivElement | null>(null);
    const [productsList, setProductsList] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams(); // moved here (must not be after conditional return)

    useEffect(() => {
        let mounted = true;
        getProducts()
            .then(data => {
                if (mounted) setProductsList(data);
            })
            .catch(() => {
                if (mounted) setProductsList([]);
            })
            .finally(() => mounted && setLoading(false));
        return () => {
            mounted = false;
        };
    }, []);

    if (loading) return <div className="container">Đang tải...</div>;

    const pageParam = parseInt(searchParams.get('page') || '1', 10);
    const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;

    const pageSize = 20;
    const totalPages = Math.max(1, Math.ceil(productsList.length / pageSize));
    const start = (page - 1) * pageSize;
    const pagedProducts = productsList.slice(start, start + pageSize);
    const topPicks = productsList.slice(0, 8);

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    const scrollByCard = (dir: 'left' | 'right') => {
        const el = carouselRef.current;
        if (!el) return;
        const first = el.firstElementChild as HTMLElement | null;
        const cardWidth = first ? first.offsetWidth : 220;
        const gap = 12;
        const amount = cardWidth + gap;
        el.scrollBy({
            left: dir === 'right' ? amount : -amount,
            behavior: 'smooth',
        });
    };

    return (
        <div className="homepage-wrapper">
            <div className="container">
                {/* === KHU VỰC 1: BANNER TRƯỢT LỚN (SLIDER) === */}
                <section className="banner-section">
                    <BannerSlider
                        banners={[
                            {
                                id: 1,
                                title: 'Khuyến mãi iPhone 15',
                                image: 'https://placehold.co/1200x300.png?text=iPhone+15+Promotion',
                                link: '/search?q=iPhone%2015',
                            },
                            {
                                id: 2,
                                title: 'Laptop giảm giá sốc',
                                image: 'https://placehold.co/1200x300.png?text=Laptop+Sale',
                                link: '/search?q=Laptop',
                            },
                            {
                                id: 3,
                                title: 'Apple Watch mới nhất',
                                image: 'https://placehold.co/1200x300.png?text=Apple+Watch+Series+9',
                                link: '/search?q=Apple%20Watch',
                            },
                        ]}
                    />
                </section>
                {/* === KHU VỰC 2: 2 BANNER NHỎ === */}
                <section className="small-banners-section">
                    <Link to="/search?q=iPhone%2015" className="small-banner-item">
                        <img
                            src="https://placehold.co/600x150.png?text=Small+Banner+1"
                            alt="Small Banner 1"
                        />
                    </Link>
                    <Link to="/search?q=Laptop" className="small-banner-item">
                        <img
                            src="https://placehold.co/600x150.png?text=Small+Banner+2"
                            alt="Small Banner 2"
                        />
                    </Link>
                </section>
                {/* === KHU VỰC 3: GỢI Ý CHO BẠN === */}
                <section className="suggestion-section">
                    <h2 className="section-title">Gợi ý cho bạn</h2>
                    <div className="carousel-wrapper">
                        <button
                            className="carousel-btn btn-prev"
                            aria-label="Previous suggestions"
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
                            aria-label="Next suggestions"
                            onClick={() => scrollByCard('right')}
                        >
                            ›
                        </button>
                    </div>
                </section>

                {/* === KHU VỰC 4: LƯỚI SẢN PHẨM CHÍNH === */}
                <section className="main-products-section">
                    <h2 className="section-title">Sản phẩm dành cho bạn</h2>
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
