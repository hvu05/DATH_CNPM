import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '@/components/common/ProductCard';
import { products } from '@/services/MockData';
import type { Product } from '@/services/MockData';
import { Select, Empty, Slider, Checkbox, Button, Input, Popover, Space, Tag, Badge } from 'antd';
import { FilterOutlined, DownOutlined, CloseOutlined } from '@ant-design/icons';
import './SearchPage.scss';

const { Option } = Select;

const SearchPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';

    // State
    const [sortBy, setSortBy] = useState<string>('default');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000000]);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [filteredResults, setFilteredResults] = useState<Product[]>(products);

    // State quản lý việc mở Popover (Optional: để đóng popup sau khi chọn nếu muốn)
    const [openCategory, setOpenCategory] = useState(false);
    const [openBrand, setOpenBrand] = useState(false);
    const [openPrice, setOpenPrice] = useState(false);

    // --- DATA PROCESSING ---
    const brands: string[] = useMemo(
        () => Array.from(new Set(products.map(p => p.brand).filter((b): b is string => !!b))),
        []
    );

    const categoriesFromData: string[] = useMemo(
        () => Array.from(new Set(products.map(p => p.category).filter((c): c is string => !!c))),
        []
    );

    const productCategories = useMemo(
        () => [
            { id: 'phones', name: 'Điện thoại' },
            { id: 'laptops', name: 'Laptop' },
            { id: 'watches', name: 'Đồng hồ' },
            { id: 'tablets', name: 'Máy tính bảng' },
            { id: 'accessories', name: 'Phụ kiện' },
            ...categoriesFromData
                .filter(
                    c => !['phones', 'laptops', 'watches', 'tablets', 'accessories'].includes(c)
                )
                .map(c => ({ id: c, name: c })),
        ],
        [categoriesFromData]
    );

    // Helpers
    const getOriginalPrice = (p: Product) =>
        typeof (p as any).originalPrice === 'number' ? (p as any).originalPrice : p.price;

    // --- FILTER EFFECT ---
    useEffect(() => {
        let results = [...products];

        if (query) {
            const q = query.toLowerCase();
            results = results.filter(
                p =>
                    p.name.toLowerCase().includes(q) ||
                    (p.description || '').toLowerCase().includes(q)
            );
        }

        results = results.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

        if (selectedBrands.length > 0) {
            results = results.filter(p => (p.brand ? selectedBrands.includes(p.brand) : false));
        }

        if (selectedCategories.length > 0) {
            results = results.filter(p =>
                p.category ? selectedCategories.includes(p.category) : false
            );
        }

        // Sorting
        if (sortBy === 'price-asc') results.sort((a, b) => a.price - b.price);
        else if (sortBy === 'price-desc') results.sort((a, b) => b.price - a.price);
        else if (sortBy === 'name-asc') results.sort((a, b) => a.name.localeCompare(b.name));
        else if (sortBy === 'name-desc') results.sort((a, b) => b.name.localeCompare(a.name));
        else if (sortBy === 'discount') {
            const getDiscount = (p: Product) => getOriginalPrice(p) - p.price;
            results.sort((a, b) => getDiscount(b) - getDiscount(a));
        }

        setFilteredResults(results);
    }, [query, sortBy, priceRange, selectedBrands, selectedCategories]);

    // --- HANDLERS ---
    const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Number(e.target.value);
        if (!isNaN(val)) setPriceRange([val, priceRange[1]]);
    };

    const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Number(e.target.value);
        if (!isNaN(val)) setPriceRange([priceRange[0], val]);
    };

    const clearFilters = () => {
        setPriceRange([0, 50000000]);
        setSelectedBrands([]);
        setSelectedCategories([]);
        setSortBy('default');
    };

    // --- POPOVER CONTENT RENDERS ---

    // 1. Category Content
    const categoryContent = (
        <div className="filter-popup-content">
            <div className="checkbox-group-scroll">
                {productCategories.map(category => (
                    <div key={category.id} className="filter-item-row">
                        <Checkbox
                            checked={selectedCategories.includes(category.id)}
                            onChange={e => {
                                const newCats = e.target.checked
                                    ? [...selectedCategories, category.id]
                                    : selectedCategories.filter(c => c !== category.id);
                                setSelectedCategories(newCats);
                            }}
                        >
                            {category.name}
                        </Checkbox>
                    </div>
                ))}
            </div>
            <div className="filter-footer">
                <Button
                    size="small"
                    type="link"
                    onClick={() => setSelectedCategories([])}
                    disabled={selectedCategories.length === 0}
                >
                    Bỏ chọn
                </Button>
                <Button size="small" type="primary" onClick={() => setOpenCategory(false)}>
                    Áp dụng
                </Button>
            </div>
        </div>
    );

    // 2. Brand Content
    const brandContent = (
        <div className="filter-popup-content">
            <div className="checkbox-group-scroll">
                {brands.map(brand => (
                    <div key={brand} className="filter-item-row">
                        <Checkbox
                            checked={selectedBrands.includes(brand)}
                            onChange={e => {
                                const newBrands = e.target.checked
                                    ? [...selectedBrands, brand]
                                    : selectedBrands.filter(b => b !== brand);
                                setSelectedBrands(newBrands);
                            }}
                        >
                            {brand}
                        </Checkbox>
                    </div>
                ))}
            </div>
            <div className="filter-footer">
                <Button
                    size="small"
                    type="link"
                    onClick={() => setSelectedBrands([])}
                    disabled={selectedBrands.length === 0}
                >
                    Bỏ chọn
                </Button>
                <Button size="small" type="primary" onClick={() => setOpenBrand(false)}>
                    Áp dụng
                </Button>
            </div>
        </div>
    );

    // 3. Price Content
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
                    onChange={handleMinPriceChange}
                    prefix="Từ"
                    suffix="đ"
                />
                <span className="separator">-</span>
                <Input
                    type="number"
                    value={priceRange[1]}
                    onChange={handleMaxPriceChange}
                    prefix="Đến"
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

    // --- RENDER ---
    const activeFiltersCount =
        selectedBrands.length +
        selectedCategories.length +
        (priceRange[0] > 0 || priceRange[1] < 50000000 ? 1 : 0);

    return (
        <div className="search-page">
            <div className="container">
                {/* FILTER BAR NGANG */}
                <div className="filter-bar-container">
                    <div className="filter-bar-left">
                        <span className="filter-label">
                            <FilterOutlined /> Bộ lọc:
                        </span>

                        {/* Danh mục */}
                        <Popover
                            content={categoryContent}
                            trigger="click"
                            placement="bottomLeft"
                            open={openCategory}
                            onOpenChange={setOpenCategory}
                        >
                            <Button
                                className={selectedCategories.length > 0 ? 'active-filter-btn' : ''}
                            >
                                Danh mục{' '}
                                {selectedCategories.length > 0 && `(${selectedCategories.length})`}{' '}
                                <DownOutlined />
                            </Button>
                        </Popover>

                        {/* Thương hiệu */}
                        <Popover
                            content={brandContent}
                            trigger="click"
                            placement="bottomLeft"
                            open={openBrand}
                            onOpenChange={setOpenBrand}
                        >
                            <Button
                                className={selectedBrands.length > 0 ? 'active-filter-btn' : ''}
                            >
                                Thương hiệu{' '}
                                {selectedBrands.length > 0 && `(${selectedBrands.length})`}{' '}
                                <DownOutlined />
                            </Button>
                        </Popover>

                        {/* Giá */}
                        <Popover
                            content={priceContent}
                            trigger="click"
                            placement="bottomLeft"
                            open={openPrice}
                            onOpenChange={setOpenPrice}
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

                    {/* Sắp xếp nằm cùng hàng bên phải */}
                    <div className="filter-bar-right">
                        <span className="sort-label">Sắp xếp:</span>
                        <Select
                            value={sortBy}
                            onChange={setSortBy}
                            style={{ width: 160 }}
                            bordered={false}
                            className="custom-sort-select"
                        >
                            <Option value="default">Mặc định</Option>
                            <Option value="price-asc">Giá tăng dần</Option>
                            <Option value="price-desc">Giá giảm dần</Option>
                            <Option value="name-asc">Tên A-Z</Option>
                            <Option value="name-desc">Tên Z-A</Option>
                            <Option value="discount">Giảm giá nhiều</Option>
                        </Select>
                    </div>
                </div>

                {/* Active Filters Tags (Hiển thị những gì đang chọn để người dùng dễ xóa) */}
                {activeFiltersCount > 0 && (
                    <div className="active-filters-list">
                        {selectedCategories.map(c => {
                            const name = productCategories.find(cat => cat.id === c)?.name || c;
                            return (
                                <Tag
                                    key={c}
                                    closable
                                    onClose={() =>
                                        setSelectedCategories(
                                            selectedCategories.filter(item => item !== c)
                                        )
                                    }
                                >
                                    Danh mục: {name}
                                </Tag>
                            );
                        })}
                        {selectedBrands.map(b => (
                            <Tag
                                key={b}
                                closable
                                onClose={() =>
                                    setSelectedBrands(selectedBrands.filter(item => item !== b))
                                }
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
                        <Button type="link" size="small" onClick={clearFilters} danger>
                            Xóa tất cả
                        </Button>
                    </div>
                )}

                {/* SEARCH RESULTS */}
                <div className="search-results-area">
                    {query && <h2>Kết quả tìm kiếm cho "{query}"</h2>}

                    {filteredResults.length > 0 ? (
                        <div className="product-grid">
                            {filteredResults.map(product => (
                                <ProductCard key={product.id} {...product} />
                            ))}
                        </div>
                    ) : (
                        <Empty
                            description="Không tìm thấy sản phẩm nào"
                            style={{ margin: '50px 0' }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
