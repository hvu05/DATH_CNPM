import React, { useRef, useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getProducts } from '@/services/productsApi';
import { getCategories } from '@/services/categoryApi';
import { getBrands } from '@/services/brandApi';
import type { Product } from '@/types/product';
import ProductCard from '@/components/common/ProductCard';
import BannerSlider from '@/components/common/BannerSlider';

// Import UI cho bộ lọc
import { Select, Slider, Checkbox, Button, Input, Popover, Tag, Empty } from 'antd';
import { FilterOutlined, DownOutlined } from '@ant-design/icons';

import './HomePage.scss';

const { Option } = Select;

const HomePage: React.FC = () => {
    // --- 1. STATE & HOOKS ---
    const [searchParams, setSearchParams] = useSearchParams();

    // Dữ liệu gốc và dữ liệu sau khi lọc
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [filteredResults, setFilteredResults] = useState<Product[]>([]);

    // Dữ liệu cho bộ lọc
    const [apiCategories, setApiCategories] = useState<{ id: string; name: string }[]>([]);
    const [apiBrands, setApiBrands] = useState<{ id: string; name: string }[]>([]);

    const [loading, setLoading] = useState(true);

    // State của bộ lọc
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000000]);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState('default');

    // UI Popover States
    const [openCategory, setOpenCategory] = useState(false);
    const [openBrand, setOpenBrand] = useState(false);
    const [openPrice, setOpenPrice] = useState(false);

    // Pagination Params
    const pageParam = parseInt(searchParams.get('page') || '1', 10);
    const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
    const pageSize = 20;

    // --- 2. FETCH DATA ---
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [productsData, categoriesData, brandsData] = await Promise.all([
                getProducts({ limit: 1000, page: 1 }),
                getCategories(),
                getBrands(),
            ]);

            setAllProducts(Array.isArray(productsData) ? productsData : []);
            setApiCategories(Array.isArray(categoriesData) ? categoriesData : []);
            setApiBrands(Array.isArray(brandsData) ? brandsData : []);

            setLoading(false);
        };
        fetchData();
    }, []);

    // Scroll lên đầu khi đổi trang
    useEffect(() => {
        if (!loading) {
            const productSection = document.getElementById('main-products-anchor');
            if (productSection) {
                productSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [page]);

    // --- 3. LOGIC LỌC (CLIENT-SIDE) ---
    useEffect(() => {
        let results = [...allProducts];

        // Lọc Giá
        results = results.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

        // Lọc Hãng
        if (selectedBrands.length > 0) {
            results = results.filter(p => {
                const brand = (p.brand || '').toLowerCase();
                return selectedBrands.some(b => brand.includes(b.toLowerCase()));
            });
        }

        // Lọc Danh mục
        if (selectedCategories.length > 0) {
            results = results.filter(p => {
                const cat = (p.category || '').toLowerCase();
                return selectedCategories.some(c => cat.includes(c.toLowerCase()));
            });
        }

        // Sắp xếp
        if (sortBy === 'price-asc') results.sort((a, b) => a.price - b.price);
        else if (sortBy === 'price-desc') results.sort((a, b) => b.price - a.price);
        else if (sortBy === 'name-asc') results.sort((a, b) => a.name.localeCompare(b.name));

        setFilteredResults(results);

        if (page !== 1) {
            setSearchParams(prev => {
                prev.set('page', '1');
                return prev;
            });
        }
    }, [allProducts, priceRange, selectedBrands, selectedCategories, sortBy]);

    // --- 4. TÍNH TOÁN PHÂN TRANG DỰA TRÊN KẾT QUẢ LỌC ---
    const totalPages = Math.max(1, Math.ceil(filteredResults.length / pageSize));
    const start = (page - 1) * pageSize;
    const pagedProducts = filteredResults.slice(start, start + pageSize);
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    // Logic Carousel (Không đổi)
    const carouselRef = useRef<HTMLDivElement | null>(null);
    const scrollByCard = (dir: 'left' | 'right') => {
        const el = carouselRef.current;
        if (!el) return;
        const amount = 300;
        el.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' });
    };

    const topPicks = allProducts.slice(0, 8);
    // --- 5. RENDER CONTENT CHO POPOVER (Copy từ SearchPage) ---
    const categoryContent = (
        <div className="filter-popup-content">
            <div className="checkbox-group-scroll">
                {apiCategories.map(c => (
                    <div key={c.id} className="filter-item-row">
                        <Checkbox
                            checked={selectedCategories.includes(c.name)}
                            onChange={e =>
                                setSelectedCategories(prev =>
                                    e.target.checked
                                        ? [...prev, c.name]
                                        : prev.filter(x => x !== c.name)
                                )
                            }
                        >
                            {c.name}
                        </Checkbox>
                    </div>
                ))}
            </div>
            <div className="filter-footer">
                <Button size="small" type="link" onClick={() => setSelectedCategories([])}>
                    Bỏ chọn
                </Button>
                <Button size="small" type="primary" onClick={() => setOpenCategory(false)}>
                    Áp dụng
                </Button>
            </div>
        </div>
    );

    const brandContent = (
        <div className="filter-popup-content">
            <div className="checkbox-group-scroll">
                {apiBrands.map(b => (
                    <div key={b.id} className="filter-item-row">
                        <Checkbox
                            checked={selectedBrands.includes(b.name)}
                            onChange={e =>
                                setSelectedBrands(prev =>
                                    e.target.checked
                                        ? [...prev, b.name]
                                        : prev.filter(x => x !== b.name)
                                )
                            }
                        >
                            {b.name}
                        </Checkbox>
                    </div>
                ))}
            </div>
            <div className="filter-footer">
                <Button size="small" type="link" onClick={() => setSelectedBrands([])}>
                    Bỏ chọn
                </Button>
                <Button size="small" type="primary" onClick={() => setOpenBrand(false)}>
                    Áp dụng
                </Button>
            </div>
        </div>
    );

    const priceContent = (
        <div className="filter-popup-content price-popup">
            <Slider
                range
                min={0}
                max={50000000}
                step={500000}
                value={priceRange}
                onChange={val => setPriceRange(val as [number, number])}
            />
            <div className="price-inputs">
                <Input
                    type="number"
                    value={priceRange[0]}
                    suffix="đ"
                    onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
                />
                <span>-</span>
                <Input
                    type="number"
                    value={priceRange[1]}
                    suffix="đ"
                    onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                />
            </div>
            <div className="filter-footer">
                <Button size="small" type="link" onClick={() => setPriceRange([0, 50000000])}>
                    Đặt lại
                </Button>
                <Button size="small" type="primary" onClick={() => setOpenPrice(false)}>
                    Áp dụng
                </Button>
            </div>
        </div>
    );

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
                                image: 'https://mir-s3-cdn-cf.behance.net/project_modules/max_3840_webp/34b5bf180145769.6505ae7623131.jpg',
                                link: '/search?q=iphone',
                            },
                            {
                                id: 2,
                                title: 'Laptop',
                                image: 'https://file.hstatic.net/200000277379/collection/asus_206cf740382a4fb98d1ba7315767faa1.png',
                                link: '/search?q=laptop',
                            },
                            {
                                id: 3,
                                title: 'Summer',
                                image: 'https://macad.vn/upload/banner-watch-seri4.jpg',
                                link: '/search?q=watch',
                            },
                        ]}
                    />
                </section>

                {/* 2. BANNER NHỎ */}
                <section className="small-banners-section">
                    <Link to="/search?q=samsung" className="small-banner-item">
                        <img
                            src="https://1546389216.rsc.cdn77.org/getthumbnail.aspx?q=60&crop=1&h=225&w=400&id_file=985121201"
                            alt="Banner 1"
                        />
                    </Link>
                    <Link to="/search?q=macbook" className="small-banner-item">
                        <img
                            src="https://www.fonezone.ae/cdn/shop/articles/MacBook_Air_M2_Price_and_Specifications_-_Fonezone.ae.png?v=1735129101"
                            alt="Banner 2"
                        />
                    </Link>
                </section>

                {/* 3. GỢI Ý */}
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

                {/* 4. LƯỚI SẢN PHẨM CHÍNH + BỘ LỌC */}
                <section className="main-products-section" id="main-products-anchor">
                    <h2 className="section-title">Tất cả sản phẩm</h2>

                    {/* --- FILTER BAR START --- */}
                    <div className="filter-bar-container">
                        <div className="filter-bar-left">
                            <span className="filter-label">
                                <FilterOutlined /> Bộ lọc:
                            </span>

                            <Popover
                                content={categoryContent}
                                trigger="click"
                                open={openCategory}
                                onOpenChange={setOpenCategory}
                                placement="bottomLeft"
                            >
                                <Button
                                    className={selectedCategories.length ? 'active-filter-btn' : ''}
                                >
                                    Danh mục{' '}
                                    {selectedCategories.length > 0 &&
                                        `(${selectedCategories.length})`}{' '}
                                    <DownOutlined />
                                </Button>
                            </Popover>

                            <Popover
                                content={brandContent}
                                trigger="click"
                                open={openBrand}
                                onOpenChange={setOpenBrand}
                                placement="bottomLeft"
                            >
                                <Button
                                    className={selectedBrands.length ? 'active-filter-btn' : ''}
                                >
                                    Thương hiệu{' '}
                                    {selectedBrands.length > 0 && `(${selectedBrands.length})`}{' '}
                                    <DownOutlined />
                                </Button>
                            </Popover>

                            <Popover
                                content={priceContent}
                                trigger="click"
                                open={openPrice}
                                onOpenChange={setOpenPrice}
                                placement="bottomLeft"
                            >
                                <Button
                                    className={
                                        priceRange[0] > 0 || priceRange[1] < 50000000
                                            ? 'active-filter-btn'
                                            : ''
                                    }
                                >
                                    Giá <DownOutlined />
                                </Button>
                            </Popover>
                        </div>

                        <div className="filter-bar-right">
                            Sắp xếp:
                            <Select
                                value={sortBy}
                                onChange={setSortBy}
                                style={{ width: 150 }}
                                variant="borderless"
                            >
                                <Option value="default">Mặc định</Option>
                                <Option value="price-asc">Giá tăng dần</Option>
                                <Option value="price-desc">Giá giảm dần</Option>
                                <Option value="name-asc">Tên A-Z</Option>
                            </Select>
                        </div>
                    </div>

                    {/* Active Filters Display */}
                    {(selectedCategories.length > 0 ||
                        selectedBrands.length > 0 ||
                        priceRange[0] > 0 ||
                        priceRange[1] < 50000000) && (
                        <div className="active-filters-list">
                            {selectedCategories.map(c => (
                                <Tag
                                    closable
                                    onClose={() =>
                                        setSelectedCategories(p => p.filter(x => x !== c))
                                    }
                                    key={c}
                                >
                                    Danh mục: {c}
                                </Tag>
                            ))}
                            {selectedBrands.map(b => (
                                <Tag
                                    closable
                                    onClose={() => setSelectedBrands(p => p.filter(x => x !== b))}
                                    key={b}
                                >
                                    Hãng: {b}
                                </Tag>
                            ))}
                            {(priceRange[0] > 0 || priceRange[1] < 50000000) && (
                                <Tag closable onClose={() => setPriceRange([0, 50000000])}>
                                    Giá: {priceRange[0].toLocaleString()} -{' '}
                                    {priceRange[1].toLocaleString()}
                                </Tag>
                            )}
                            <Button
                                type="link"
                                danger
                                size="small"
                                onClick={() => {
                                    setSelectedCategories([]);
                                    setSelectedBrands([]);
                                    setPriceRange([0, 50000000]);
                                }}
                            >
                                Xóa tất cả
                            </Button>
                        </div>
                    )}
                    {/* --- FILTER BAR END --- */}

                    {filteredResults.length > 0 ? (
                        <>
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
                        </>
                    ) : (
                        <Empty description="Không tìm thấy sản phẩm phù hợp" />
                    )}
                </section>
            </div>
        </div>
    );
};

export default HomePage;
