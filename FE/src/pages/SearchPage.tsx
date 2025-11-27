// FE/src/pages/SearchPage.tsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '@/components/common/ProductCard';
import { getProducts } from '@/services/productsApi';
import type { Product } from '@/types/product';
import { Empty, Input, Slider, Button, Tag, Popover, Checkbox, Select } from 'antd';
import { FilterOutlined, DownOutlined } from '@ant-design/icons';
import './SearchPage.scss';

const { Option } = Select;

const SearchPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q') || '';

    const [products, setProducts] = useState<Product[]>([]);
    const [filteredResults, setFilteredResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    // Các state filter (priceRange, etc...) giữ nguyên như cũ
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000000]);
    const [sortBy, setSortBy] = useState('default');

    // 1. Fetch Data từ API
    useEffect(() => {
        const fetchSearch = async () => {
            setLoading(true);
            const data = await getProducts(); // Lấy tất cả về rồi filter client (hoặc truyền params nếu BE hỗ trợ)
            setProducts(data);
            setLoading(false);
        };
        fetchSearch();
    }, []);

    // 2. Xử lý Filter (Logic giống cũ nhưng chạy trên state products từ API)
    useEffect(() => {
        let results = [...products];

        // Lọc theo tên
        if (query) {
            results = results.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
        }
        // Lọc giá
        results = results.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

        // Sort
        if (sortBy === 'price-asc') results.sort((a, b) => a.price - b.price);
        else if (sortBy === 'price-desc') results.sort((a, b) => b.price - a.price);

        setFilteredResults(results);
    }, [query, products, priceRange, sortBy]);

    // --- Phần Render giữ nguyên cấu trúc cũ, chỉ thay data source ---
    return (
        <div className="search-page">
            <div className="container">
                {/* Giữ nguyên phần Filter Bar như code cũ của bạn */}
                {/* ... */}

                <div className="search-results-area">
                    {query && <h2>Kết quả tìm kiếm cho "{query}"</h2>}
                    {loading ? (
                        <div>Đang tìm...</div>
                    ) : filteredResults.length > 0 ? (
                        <div className="product-grid">
                            {filteredResults.map(product => (
                                <ProductCard key={product.id} {...product} />
                            ))}
                        </div>
                    ) : (
                        <Empty description="Không tìm thấy sản phẩm nào" />
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
