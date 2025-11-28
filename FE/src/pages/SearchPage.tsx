// FE/src/pages/SearchPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '@/components/common/ProductCard';
import { getProducts } from '@/services/productsApi';
import type { Product } from '@/types/product';
import { Empty, Select, Button, Input, Slider, Checkbox, Popover, Tag } from 'antd';
import { FilterOutlined, DownOutlined } from '@ant-design/icons';
import './SearchPage.scss';

const { Option } = Select;

const SearchPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';

    const [products, setProducts] = useState<Product[]>([]);
    const [filteredResults, setFilteredResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000000]);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState('default');

    const [openCategory, setOpenCategory] = useState(false);
    const [openBrand, setOpenBrand] = useState(false);
    const [openPrice, setOpenPrice] = useState(false);

    useEffect(() => {
        const fetchSearch = async () => {
            setLoading(true);
            const data = await getProducts();
            setProducts(data);
            setLoading(false);
        };
        fetchSearch();
    }, []);

    const brands = useMemo(
        () => Array.from(new Set(products.map(p => p.brand).filter(Boolean) as string[])),
        [products]
    );
    const categories = useMemo(
        () => Array.from(new Set(products.map(p => p.category).filter(Boolean) as string[])),
        [products]
    );

    useEffect(() => {
        let results = [...products];

        // Search Text
        if (query) {
            results = results.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
        }
        // Price
        results = results.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
        // Brand
        if (selectedBrands.length > 0) {
            results = results.filter(p => p.brand && selectedBrands.includes(p.brand));
        }
        // Category
        if (selectedCategories.length > 0) {
            results = results.filter(p => p.category && selectedCategories.includes(p.category));
        }
        // Sort
        if (sortBy === 'price-asc') results.sort((a, b) => a.price - b.price);
        else if (sortBy === 'price-desc') results.sort((a, b) => b.price - a.price);
        else if (sortBy === 'name-asc') results.sort((a, b) => a.name.localeCompare(b.name));

        setFilteredResults(results);
    }, [query, products, priceRange, selectedBrands, selectedCategories, sortBy]);

    const brandContent = (
        <div className="filter-popup-content">
            <div className="checkbox-group-scroll">
                {brands.map(b => (
                    <div key={b} className="filter-item-row">
                        <Checkbox
                            checked={selectedBrands.includes(b)}
                            onChange={e => {
                                setSelectedBrands(prev =>
                                    e.target.checked ? [...prev, b] : prev.filter(x => x !== b)
                                );
                            }}
                        >
                            {b}
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

    const categoryContent = (
        <div className="filter-popup-content">
            <div className="checkbox-group-scroll">
                {categories.map(c => (
                    <div key={c} className="filter-item-row">
                        <Checkbox
                            checked={selectedCategories.includes(c)}
                            onChange={e => {
                                setSelectedCategories(prev =>
                                    e.target.checked ? [...prev, c] : prev.filter(x => x !== c)
                                );
                            }}
                        >
                            {c}
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
                                Danh mục <DownOutlined />
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
                                Thương hiệu <DownOutlined />
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
                        <span className="sort-label">Sắp xếp:</span>
                        <Select
                            value={sortBy}
                            onChange={setSortBy}
                            style={{ width: 150 }}
                            bordered={false}
                        >
                            <Option value="default">Mặc định</Option>
                            <Option value="price-asc">Giá tăng dần</Option>
                            <Option value="price-desc">Giá giảm dần</Option>
                            <Option value="name-asc">Tên A-Z</Option>
                        </Select>
                    </div>
                </div>

                {/* Active Filter Tags */}
                {(selectedBrands.length > 0 ||
                    selectedCategories.length > 0 ||
                    priceRange[0] > 0) && (
                    <div className="active-filters-list">
                        {selectedBrands.map(b => (
                            <Tag
                                key={b}
                                closable
                                onClose={() => setSelectedBrands(p => p.filter(x => x !== b))}
                            >
                                {b}
                            </Tag>
                        ))}
                        {selectedCategories.map(c => (
                            <Tag
                                key={c}
                                closable
                                onClose={() => setSelectedCategories(p => p.filter(x => x !== c))}
                            >
                                {c}
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
                            onClick={() => {
                                setSelectedBrands([]);
                                setSelectedCategories([]);
                                setPriceRange([0, 50000000]);
                            }}
                        >
                            Xóa tất cả
                        </Button>
                    </div>
                )}

                <div className="search-results-area">
                    {query && <h2>Kết quả tìm kiếm cho "{query}"</h2>}
                    {loading ? (
                        <div>Đang tìm kiếm...</div>
                    ) : filteredResults.length > 0 ? (
                        <div className="product-grid">
                            {filteredResults.map(product => (
                                <ProductCard key={product.id} {...product} />
                            ))}
                        </div>
                    ) : (
                        <Empty description="Không tìm thấy sản phẩm" />
                    )}
                </div>
            </div>
        </div>
    );
};
export default SearchPage;
