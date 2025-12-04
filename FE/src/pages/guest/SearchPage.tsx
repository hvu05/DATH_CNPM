import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from '@/components/common/ProductCard';
import { getProducts } from '@/services/productsApi';
import type { Product } from '@/types/product';
import { Select, Empty, Slider, Checkbox, Button, Input, Popover, Tag, Spin } from 'antd';
import { FilterOutlined, DownOutlined } from '@ant-design/icons';
import './SearchPage.scss';
import { getCategories } from '@/services/categoryApi';
import { getBrands } from '@/services/brandApi';
const { Option } = Select;

// --- DỮ LIỆU BỘ LỌC CỐ ĐỊNH  ---
const SearchPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q') || searchParams.get('search') || '';

    // Pagination từ URL
    const pageParam = parseInt(searchParams.get('page') || '1', 10);
    const currentPage = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
    const pageSize = 12;

    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [filteredResults, setFilteredResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    // States bộ lọc
    const [apiCategories, setApiCategories] = useState<{ id: string; name: string }[]>([]);
    const [apiBrands, setApiBrands] = useState<{ id: string; name: string }[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000000]);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    useEffect(() => {
        const brandParam = searchParams.get('brand');

        if (brandParam) {
            setSelectedBrands([brandParam]);
        }
    }, [searchParams]);

    const [sortBy, setSortBy] = useState('default');

    // UI Popover States
    const [openCategory, setOpenCategory] = useState(false);
    const [openBrand, setOpenBrand] = useState(false);
    const [openPrice, setOpenPrice] = useState(false);

    // 1. Fetch dữ liệu
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            const [products, categories, brands] = await Promise.all([
                getProducts(),
                getCategories(),
                getBrands(),
            ]);

            setAllProducts(Array.isArray(products) ? products : []);

            setApiCategories(Array.isArray(categories) ? categories : []);
            setApiBrands(Array.isArray(brands) ? brands : []);

            setLoading(false);
        };

        fetchData();
    }, []);

    // 2. Logic Lọc Client-side
    useEffect(() => {
        let results = [...allProducts];

        // Lọc theo từ khóa
        if (query) {
            const q = query.toLowerCase();
            results = results.filter(
                p =>
                    p.name.toLowerCase().includes(q) ||
                    (p.brand && p.brand.toLowerCase().includes(q)) ||
                    (p.category && p.category.toLowerCase().includes(q))
            );
        }

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
    }, [allProducts, query, priceRange, selectedBrands, selectedCategories, sortBy]);

    // Pagination Calculation
    const totalPages = Math.max(1, Math.ceil(filteredResults.length / pageSize));
    const start = (currentPage - 1) * pageSize;
    const currentData = filteredResults.slice(start, start + pageSize);
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    const handlePageChange = (page: number) => {
        setSearchParams(prev => {
            prev.set('page', page.toString());
            return prev;
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // --- RENDERS NỘI DUNG POPOVER  ---
    const categoryContent = (
        <div className="filter-popup-content">
            <div className="checkbox-group-scroll">
                {(Array.isArray(apiCategories) ? apiCategories : []).map(c => (
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
                {(Array.isArray(apiBrands) ? apiBrands : []).map(b => (
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
                    onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
                    suffix="đ"
                />
                <span>-</span>
                <Input
                    type="number"
                    value={priceRange[1]}
                    onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                    suffix="đ"
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

    return (
        <div className="search-page">
            <div className="container">
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
                                {selectedCategories.length > 0 && `(${selectedCategories.length})`}{' '}
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
                            <Button className={selectedBrands.length ? 'active-filter-btn' : ''}>
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

                {/* Active Filters */}
                {(selectedCategories.length > 0 ||
                    selectedBrands.length > 0 ||
                    priceRange[0] > 0 ||
                    priceRange[1] < 50000000) && (
                    <div className="active-filters-list">
                        {selectedCategories.map(c => (
                            <Tag
                                closable
                                onClose={() => setSelectedCategories(p => p.filter(x => x !== c))}
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

                <div className="search-results-area">
                    {query && (
                        <h2>
                            Kết quả cho "{query}"{' '}
                            <span style={{ fontSize: '0.8em', color: '#666' }}>
                                ({filteredResults.length} sản phẩm)
                            </span>
                        </h2>
                    )}

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: 50 }}>
                            <Spin size="large" />
                        </div>
                    ) : filteredResults.length > 0 ? (
                        <>
                            <div className="product-grid">
                                {currentData.map(p => (
                                    <ProductCard key={p.id} {...p} />
                                ))}
                            </div>

                            {/* CUSTOM PAGINATION */}
                            <div className="pagination-wrapper">
                                <div className="pagination">
                                    <button
                                        className={`page-btn ${currentPage === 1 ? 'disabled' : ''}`}
                                        onClick={() =>
                                            currentPage > 1 && handlePageChange(currentPage - 1)
                                        }
                                        disabled={currentPage === 1}
                                    >
                                        &laquo; Prev
                                    </button>
                                    {pageNumbers.map(p => (
                                        <button
                                            key={p}
                                            className={`page-number ${p === currentPage ? 'active' : ''}`}
                                            onClick={() => handlePageChange(p)}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                    <button
                                        className={`page-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                                        onClick={() =>
                                            currentPage < totalPages &&
                                            handlePageChange(currentPage + 1)
                                        }
                                        disabled={currentPage === totalPages}
                                    >
                                        Next &raquo;
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <Empty description="Không tìm thấy sản phẩm" style={{ margin: '50px 0' }} />
                    )}
                </div>
            </div>
        </div>
    );
};
export default SearchPage;
