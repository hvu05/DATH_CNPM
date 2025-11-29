// FE/src/pages/SearchPage.tsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '@/components/common/ProductCard';
import { getProducts } from '@/services/productsApi'; // Dùng API thật
import type { Product } from '@/types/product';
import {
    Select,
    Empty,
    Slider,
    Checkbox,
    Button,
    Input,
    Popover,
    Tag,
    Spin,
    Pagination,
} from 'antd';
import { FilterOutlined, DownOutlined } from '@ant-design/icons';
import './SearchPage.scss';

const { Option } = Select;

const SearchPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || searchParams.get('search') || '';

    // Data States
    const [allProducts, setAllProducts] = useState<Product[]>([]); // Lưu tất cả data fetch về
    const [filteredResults, setFilteredResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    // Filter States
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000000]);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState('default');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 12;

    // Popover UI States
    const [openCategory, setOpenCategory] = useState(false);
    const [openBrand, setOpenBrand] = useState(false);
    const [openPrice, setOpenPrice] = useState(false);

    // 1. FETCH DATA TỪ API KHI MOUNT HOẶC QUERY CHANGE
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            // Fetch tất cả (hoặc theo search query)
            const data = await getProducts({ q: query });
            setAllProducts(data);
            setLoading(false);
        };
        fetchData();
    }, [query]);

    // 2. TẠO LIST BRANDS/CATEGORIES TỪ DATA THỰC TẾ (Để không bị trống)
    const availableBrands = Array.from(new Set(allProducts.map(p => p.brand || 'Khác')));
    const availableCategories = Array.from(new Set(allProducts.map(p => p.category || 'Khác')));

    // 3. LOGIC FILTER CLIENT-SIDE
    useEffect(() => {
        let results = [...allProducts];

        // Filter Price
        results = results.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

        // Filter Brand
        if (selectedBrands.length > 0) {
            results = results.filter(p => selectedBrands.includes(p.brand || 'Khác'));
        }

        // Filter Category
        if (selectedCategories.length > 0) {
            results = results.filter(p => selectedCategories.includes(p.category || 'Khác'));
        }

        // Sort
        if (sortBy === 'price-asc') results.sort((a, b) => a.price - b.price);
        else if (sortBy === 'price-desc') results.sort((a, b) => b.price - a.price);
        else if (sortBy === 'name-asc') results.sort((a, b) => a.name.localeCompare(b.name));

        setFilteredResults(results);
        setCurrentPage(1); // Reset về trang 1 khi filter
    }, [allProducts, priceRange, selectedBrands, selectedCategories, sortBy]);

    // Pagination Logic
    const currentData = filteredResults.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    // --- RENDER CONTENTS (Giống code bạn gửi) ---
    const categoryContent = (
        <div className="filter-popup-content">
            <div className="checkbox-group-scroll">
                {availableCategories.map(c => (
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

    const brandContent = (
        <div className="filter-popup-content">
            <div className="checkbox-group-scroll">
                {availableBrands.map(b => (
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

    const priceContent = (
        <div className="filter-popup-content price-popup" style={{ width: 300, padding: 15 }}>
            <Slider
                range
                min={0}
                max={50000000}
                step={500000}
                value={priceRange}
                onChange={val => setPriceRange(val as [number, number])}
            />
            <div className="price-inputs" style={{ display: 'flex', gap: 10, marginTop: 10 }}>
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
            <div className="filter-footer" style={{ marginTop: 15, textAlign: 'right' }}>
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
                {/* FILTER BAR */}
                <div
                    className="filter-bar-container"
                    style={{
                        background: '#fff',
                        padding: '15px',
                        borderRadius: 8,
                        marginBottom: 20,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <div
                        className="filter-bar-left"
                        style={{ display: 'flex', gap: 10, alignItems: 'center' }}
                    >
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
                            style={{ width: 150, marginLeft: 10 }}
                            bordered={false}
                        >
                            <Option value="default">Mặc định</Option>
                            <Option value="price-asc">Giá tăng dần</Option>
                            <Option value="price-desc">Giá giảm dần</Option>
                            <Option value="name-asc">Tên A-Z</Option>
                        </Select>
                    </div>
                </div>

                {/* TAGS ĐANG CHỌN */}
                {(selectedCategories.length > 0 ||
                    selectedBrands.length > 0 ||
                    priceRange[0] > 0 ||
                    priceRange[1] < 50000000) && (
                    <div className="active-filters" style={{ marginBottom: 20 }}>
                        {selectedCategories.map(c => (
                            <Tag
                                closable
                                onClose={() => setSelectedCategories(p => p.filter(x => x !== c))}
                                key={c}
                            >
                                {c}
                            </Tag>
                        ))}
                        {selectedBrands.map(b => (
                            <Tag
                                closable
                                onClose={() => setSelectedBrands(p => p.filter(x => x !== b))}
                                key={b}
                            >
                                {b}
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

                {/* KẾT QUẢ */}
                <div className="search-results-area">
                    {query && <h2>Kết quả cho "{query}"</h2>}

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: 50 }}>
                            <Spin size="large" />
                        </div>
                    ) : filteredResults.length > 0 ? (
                        <>
                            <div className="product-grid">
                                {currentData.map(product => (
                                    <ProductCard key={product.id} {...product} />
                                ))}
                            </div>
                            {/* PAGINATION */}
                            <div style={{ marginTop: 30, textAlign: 'center' }}>
                                <Pagination
                                    current={currentPage}
                                    total={filteredResults.length}
                                    pageSize={pageSize}
                                    onChange={setCurrentPage}
                                />
                            </div>
                        </>
                    ) : (
                        <Empty description="Không tìm thấy sản phẩm phù hợp" />
                    )}
                </div>
            </div>
        </div>
    );
};
export default SearchPage;
