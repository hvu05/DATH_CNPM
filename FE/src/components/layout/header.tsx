import './header.scss';
import homeIcon from '@/assets/home-icon.svg';
import menuIcon from '@/assets/menu-icon.svg';
import searchIcon from '@/assets/search-icon.svg';
import cartIcon from '@/assets/cart-icon.svg';
import defaultAvatar from '@/assets/default-avatar-icon.svg';
import { Link, useNavigate } from 'react-router-dom';
import { Dropdown, Avatar, Badge, message, Spin } from 'antd';
import type { MenuProps } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { useAuthContext } from '@/contexts/AuthContext';
import { removeTokens } from '@/services/auth/auth.service';
import { useCart } from '@/contexts/CartContext';
import React, { useState, useEffect, useRef } from 'react';
import { getCategories } from '@/services/categoryApi';
import { getBrands } from '@/services/brandApi';
import type { BrandResponse, Series } from '@/services/brandApi';

export const Header = () => {
    const navigate = useNavigate();
    const { user, setUser, isLoggedIn, setIsLoggedIn } = useAuthContext();
    const { cartItems } = useCart();

    const [categories, setCategories] = useState<any[]>([]);
    const [brands, setBrands] = useState<any[]>([]);
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

    // State theo dõi danh mục đang được hover
    const [activeCategory, setActiveCategory] = useState<string>('');
    const [activeBrandId, setActiveBrandId] = useState<string | number>('');
    const [loadingBrands, setLoadingBrands] = useState(false);

    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const totalCartItems = cartItems.reduce((t, i) => t + i.quantity, 0);

    // --- Logout & Menu Logic ---
    const logout = () => {
        removeTokens();
        setUser(null);
        setIsLoggedIn(false);
        navigate('/login');
        message.success('Đăng xuất thành công');
    };

    const handleMenuClick: MenuProps['onClick'] = e => {
        const { key } = e;
        if (key === 'logout') logout();
        else if (key === 'profile') navigate('/client');
        else if (key === 'adminpage') navigate('/admin/dashboard');
        else if (key === 'sellerpage') navigate('/seller/dashboard');
    };

    const menuItems: MenuProps['items'] = [
        ...(user?.role === 'CUSTOMER' || !user?.role
            ? [{ key: 'profile', label: 'Tài khoản của tôi', icon: <UserOutlined /> }]
            : []),
        ...(user?.role === 'ADMIN'
            ? [{ key: 'adminpage', label: 'Trang quản trị', icon: <SettingOutlined /> }]
            : []),
        { type: 'divider' },
        { key: 'logout', label: 'Đăng xuất', danger: true, icon: <LogoutOutlined /> },
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm('');
        }
    };

    useEffect(() => {
        const onClickOutside = (ev: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(ev.target as Node)) {
                setIsCategoryDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);

    useEffect(() => {
        const loadCategories = async () => {
            const cats = await getCategories();
            setCategories(cats || []);
            if (cats && cats.length > 0) {
                setActiveCategory(String(cats[0].id));
            }
        };
        loadCategories();
    }, []);

    useEffect(() => {
        const loadBrandsByCategory = async () => {
            if (!activeCategory) {
                setBrands([]);
                return;
            }

            setLoadingBrands(true);
            const brs = await getBrands(activeCategory);
            setBrands(brs || []);
            if (brs && brs.length > 0) {
                setActiveBrandId(brs[0].id);
            } else {
                setActiveBrandId('');
            }

            setLoadingBrands(false);
        };
        loadBrandsByCategory();
    }, [activeCategory]);

    const activeSeriesList = brands.find(b => b.id === activeBrandId)?.series || [];

    const onClickBrand = (brandName: string) => {
        setIsCategoryDropdownOpen(false);
        navigate(`/search?brand=${encodeURIComponent(brandName)}`);
    };

    const onClickSeries = (seriesName: string) => {
        setIsCategoryDropdownOpen(false);
        navigate(`/search?q=${encodeURIComponent(seriesName)}`);
    };

    return (
        <header className="header">
            <div className="header__left">
                <Link to="/" className="header__home-link">
                    <img src={homeIcon} alt="Home" />
                </Link>

                <div className="category-dropdown" ref={dropdownRef}>
                    <button
                        className="header__button"
                        onClick={() => setIsCategoryDropdownOpen(v => !v)}
                        type="button"
                    >
                        {/* ... Icon Menu ... */}
                        <span className="header__button-text">Danh mục</span>
                    </button>

                    {isCategoryDropdownOpen && (
                        <div className="category-dropdown__menu">
                            {/* CỘT 1: CATEGORIES */}
                            <div className="category-dropdown__col category-dropdown__categories">
                                <h4 className="dropdown-col-title">Danh mục</h4>
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        className={`dropdown-item ${String(activeCategory) === String(cat.id) ? 'active' : ''}`}
                                        onMouseEnter={() => setActiveCategory(String(cat.id))}
                                    >
                                        {cat.name} <span className="arrow">›</span>
                                    </button>
                                ))}
                            </div>

                            {/* CỘT 2: BRANDS */}
                            <div className="category-dropdown__col category-dropdown__brands">
                                <h4 className="dropdown-col-title">Thương hiệu</h4>
                                {loadingBrands ? (
                                    <div className="loading-state">
                                        <Spin />
                                    </div>
                                ) : brands.length > 0 ? (
                                    brands.map(b => (
                                        <button
                                            key={b.id}
                                            className={`dropdown-item ${activeBrandId === b.id ? 'active' : ''}`}
                                            onMouseEnter={() => setActiveBrandId(b.id)}
                                            onClick={() => onClickBrand(b.name)}
                                        >
                                            {b.name} <span className="arrow">›</span>
                                        </button>
                                    ))
                                ) : (
                                    <div className="empty-state">Trống</div>
                                )}
                            </div>

                            {/* CỘT 3: SERIES (MỚI) */}
                            <div className="category-dropdown__col category-dropdown__series">
                                <h4 className="dropdown-col-title">Dòng sản phẩm</h4>
                                {loadingBrands ? (
                                    <div className="loading-state">...</div>
                                ) : activeSeriesList.length > 0 ? (
                                    activeSeriesList.map((s: Series) => (
                                        <button
                                            key={s.id}
                                            className="dropdown-item"
                                            onClick={() => onClickSeries(s.name)}
                                        >
                                            {s.name}
                                        </button>
                                    ))
                                ) : (
                                    <div className="empty-state">
                                        {brands.length > 0 ? 'Chưa có dòng sản phẩm' : ''}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <form className="header__search" onSubmit={handleSearch}>
                <input
                    className="header__search-input"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Bạn tìm gì hôm nay?"
                />
                <button type="submit" className="header__search-icon">
                    <img src={searchIcon} alt="search" />
                </button>
            </form>

            <div className="header__right">
                <Link to="/cart" className="header__button">
                    <Badge count={totalCartItems} size="small" offset={[0, -2]}>
                        <img src={cartIcon} className="header__button-icon" alt="cart" />
                    </Badge>
                    <span className="header__button-text">Giỏ hàng</span>
                </Link>

                {isLoggedIn ? (
                    <Dropdown
                        menu={{ items: menuItems, onClick: handleMenuClick }}
                        placement="bottomRight"
                        arrow
                    >
                        <div
                            style={{
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                            }}
                        >
                            <Avatar src={user?.avatar || defaultAvatar} />
                            <span
                                className="header__user-name"
                                style={{ color: 'white', fontWeight: 500 }}
                            >
                                {user?.full_name || 'User'}
                            </span>
                        </div>
                    </Dropdown>
                ) : (
                    <div className="header__auth-buttons">
                        <button
                            onClick={() => navigate('/login')}
                            className="header__button"
                            type="button"
                        >
                            <span className="header__button-text">Đăng nhập</span>
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};
