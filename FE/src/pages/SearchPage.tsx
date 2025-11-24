import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '@/components/common/ProductCard';
import { products } from '@/services/MockData';
import type { Product } from '@/services/MockData';
import { Select, Empty, Slider, Checkbox, Button, Input, Radio } from 'antd';
import { FilterOutlined, CloseOutlined } from '@ant-design/icons';
import './SearchPage.scss';

const { Option } = Select;

const SearchPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    //const [searchResults] = useState<Product[]>(products);
    const [sortBy, setSortBy] = useState<string>('default');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000000]);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [filteredResults, setFilteredResults] = useState<Product[]>(products);
    const [showFilters, setShowFilters] = useState(false);
    const [inStockOnly, setInStockOnly] = useState(false);

    // Get unique brands from products (filter out undefined)
    const brands: string[] = Array.from(
        new Set(products.map(p => p.brand).filter((b): b is string => !!b))
    );

    // Get unique categories from products (filter out undefined)
    const categoriesFromData: string[] = Array.from(
        new Set(products.map(p => p.category).filter((c): c is string => !!c))
    );

    // Provide fixed category list (keeps UI labels consistent)
    const productCategories = [
        { id: 'phones', name: 'Điện thoại' },
        { id: 'laptops', name: 'Laptop' },
        { id: 'watches', name: 'Đồng hồ' },
        { id: 'tablets', name: 'Máy tính bảng' },
        { id: 'accessories', name: 'Phụ kiện' },
        // include any additional categories present in data
        ...categoriesFromData
            .filter(c => !['phones', 'laptops', 'watches', 'tablets', 'accessories'].includes(c))
            .map(c => ({ id: c, name: c })),
    ];

    // helpers for optional fields that might not exist in MockData
    const getOriginalPrice = (p: Product) =>
        typeof (p as any).originalPrice === 'number' ? (p as any).originalPrice : p.price;
    const getStock = (p: Product) => (typeof (p as any).stock === 'number' ? (p as any).stock : 0);

    useEffect(() => {
        let results = [...products];

        // Filter by search query
        if (query) {
            const q = query.toLowerCase();
            results = results.filter(
                p =>
                    p.name.toLowerCase().includes(q) ||
                    (p.description || '').toLowerCase().includes(q)
            );
        }

        // Filter by price range
        results = results.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

        // Filter by brands (only check when product has brand)
        if (selectedBrands.length > 0) {
            results = results.filter(p => (p.brand ? selectedBrands.includes(p.brand) : false));
        }

        // Filter by categories (only check when product has category)
        if (selectedCategories.length > 0) {
            results = results.filter(p =>
                p.category ? selectedCategories.includes(p.category) : false
            );
        }

        // Filter by stock status
        if (inStockOnly) {
            results = results.filter(p => getStock(p) > 0);
        }

        // Sort results
        if (sortBy === 'price-asc') {
            results.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-desc') {
            results.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'name-asc') {
            results.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === 'name-desc') {
            results.sort((a, b) => b.name.localeCompare(a.name));
        } else if (sortBy === 'discount') {
            // sort by discount amount (originalPrice - price), fallback when originalPrice missing
            const getDiscount = (p: Product) => getOriginalPrice(p) - p.price;
            results.sort((a, b) => getDiscount(b) - getDiscount(a));
        }

        setFilteredResults(results);
    }, [query, sortBy, priceRange, selectedBrands, selectedCategories, inStockOnly]);

    const handleSortChange = (value: string) => {
        setSortBy(value);
    };

    //const handleBrandChange = (checkedValues: string[]) => {
    //    setSelectedBrands(checkedValues);
    //};

    //const handleCategoryChange = (checkedValues: string[]) => {
    //    setSelectedCategories(checkedValues);
    //};

    const handlePriceChange = (value: number | number[]) => {
        if (Array.isArray(value) && value.length === 2) {
            setPriceRange([value[0], value[1]]);
        }
    };

    const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        if (!isNaN(value) && value >= 0) {
            setPriceRange([value, priceRange[1]]);
        }
    };

    const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        if (!isNaN(value) && value >= 0) {
            setPriceRange([priceRange[0], value]);
        }
    };

    const clearFilters = () => {
        setPriceRange([0, 50000000]);
        setSelectedBrands([]);
        setSelectedCategories([]);
        setSortBy('default');
        setInStockOnly(false);
    };

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    return (
        <div className={`search-page ${showFilters ? 'filter-open' : ''}`}>
            <div className="container">
                <div className="search-header">
                    <div className="search-controls">
                        <Button
                            className="filter-toggle"
                            onClick={toggleFilters}
                            icon={<FilterOutlined />}
                        >
                            Bộ lọc
                        </Button>

                        <div className="search-sort">
                            <span>Sắp xếp:</span>
                            <Select
                                value={sortBy}
                                onChange={handleSortChange}
                                style={{ width: 150, marginLeft: 8 }}
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
                </div>

                <div className="search-content">
                    <div className={`search-filters ${showFilters ? 'show' : ''}`}>
                        <div className="filter-header">
                            <h3>Bộ lọc</h3>
                            <Button
                                type="text"
                                icon={<CloseOutlined />}
                                onClick={toggleFilters}
                                className="close-filter"
                            />
                        </div>

                        <div className="filter-section">
                            <h3 className="filter-title">Khoảng giá</h3>
                            <Slider
                                range
                                min={0}
                                max={50000000}
                                step={100000}
                                value={priceRange}
                                onChange={handlePriceChange}
                                tooltip={{
                                    formatter: value => `${value?.toLocaleString('vi-VN')} đ`,
                                }}
                            />
                            <div className="price-inputs">
                                <Input
                                    value={priceRange[0]}
                                    onChange={handleMinPriceChange}
                                    prefix="Từ"
                                    suffix="đ"
                                />
                                <span>-</span>
                                <Input
                                    value={priceRange[1]}
                                    onChange={handleMaxPriceChange}
                                    prefix="Đến"
                                    suffix="đ"
                                />
                            </div>
                        </div>

                        <div className="filter-section">
                            <h3 className="filter-title">Thương hiệu</h3>
                            <div className="brand-options">
                                {brands.map(brand => (
                                    <Checkbox
                                        key={brand}
                                        checked={selectedBrands.includes(brand)}
                                        onChange={e => {
                                            if (e.target.checked) {
                                                setSelectedBrands([...selectedBrands, brand]);
                                            } else {
                                                setSelectedBrands(
                                                    selectedBrands.filter(b => b !== brand)
                                                );
                                            }
                                        }}
                                    >
                                        {brand}
                                    </Checkbox>
                                ))}
                            </div>
                        </div>

                        <div className="filter-section">
                            <h3 className="filter-title">Danh mục</h3>
                            <div className="category-options">
                                {productCategories.map(category => (
                                    <Checkbox
                                        key={category.id}
                                        checked={selectedCategories.includes(category.id)}
                                        onChange={e => {
                                            if (e.target.checked) {
                                                setSelectedCategories([
                                                    ...selectedCategories,
                                                    category.id,
                                                ]);
                                            } else {
                                                setSelectedCategories(
                                                    selectedCategories.filter(
                                                        c => c !== category.id
                                                    )
                                                );
                                            }
                                        }}
                                    >
                                        {category.name}
                                    </Checkbox>
                                ))}
                            </div>
                        </div>

                        <div className="filter-section">
                            <h3 className="filter-title">Tình trạng</h3>
                            <Radio
                                checked={inStockOnly}
                                onChange={e => setInStockOnly(e.target.checked)}
                            >
                                Chỉ hiển thị sản phẩm có hàng
                            </Radio>
                        </div>

                        <Button type="primary" onClick={clearFilters} className="clear-filters">
                            Xóa bộ lọc
                        </Button>
                    </div>

                    <div className="search-results">
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
        </div>
    );
};

export default SearchPage;
