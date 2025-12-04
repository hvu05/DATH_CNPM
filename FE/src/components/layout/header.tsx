import './header.scss';
import homeIcon from '@/assets/home-icon.svg';
import menuIcon from '@/assets/menu-icon.svg';
import searchIcon from '@/assets/search-icon.svg';
import cartIcon from '@/assets/cart-icon.svg';
import defaultAvatar from '@/assets/default-avatar-icon.svg';
import { Link, useNavigate } from 'react-router-dom';
import { Dropdown, Avatar, Badge, message } from 'antd';
import type { MenuProps } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { useAuthContext } from '@/contexts/AuthContext';
import { removeTokens } from '@/services/auth/auth.service';
import { useCart } from '@/contexts/CartContext';
import React, { useState, useEffect, useRef } from 'react';
import { getCategories } from '@/services/categoryApi';
import { getBrands } from '@/services/brandApi';

export const Header = () => {
    const navigate = useNavigate();
    const { user, setUser, isLoggedIn, setIsLoggedIn } = useAuthContext();
    const { cartItems } = useCart();

    const [categories, setCategories] = useState<any[]>([]);
    const [brands, setBrands] = useState<any[]>([]);
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState<string>('');
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const totalCartItems = cartItems.reduce((t, i) => t + i.quantity, 0);

    const logout = () => {
        removeTokens();
        setUser(null);
        setIsLoggedIn(false);
        navigate('/login');
        message.success('Đăng xuất thành công');
    };

    const menuItems: MenuProps['items'] = [
        ...(user?.role === 'CUSTOMER' || !user?.role
            ? [{ key: 'profile', label: 'Tài khoản của tôi', icon: <UserOutlined /> }]
            : []),
        ...(user?.role === 'ADMIN'
            ? [{ key: 'adminpage', label: 'Trang quản trị', icon: <SettingOutlined /> }]
            : []),
        { type: 'divider' },
        { key: 'logout', label: 'Đăng xuất', danger: true },
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
        const load = async () => {
            const [cats, brs] = await Promise.all([getCategories(), getBrands()]);
            setCategories(cats || []);
            setBrands(brs || []);
            if (cats && cats.length > 0) setActiveCategory(String(cats[0].id));
        };
        load();
    }, []);

    const onClickBrand = (brandName: string) => {
        setIsCategoryDropdownOpen(false);
        const params = new URLSearchParams();
        if (brandName) params.set('brand', brandName);
        if (activeCategory) params.set('category', String(activeCategory));
        navigate(`/search?${params.toString()}`);
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
                        <img src={menuIcon} className="header__button-icon" alt="menu" />
                        <span className="header__button-text">Danh mục</span>
                    </button>

                    {isCategoryDropdownOpen && (
                        <div className="category-dropdown__menu">
                            <div className="category-dropdown__categories">
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        className={`category-dropdown__category-item ${String(activeCategory) === String(cat.id) ? 'active' : ''}`}
                                        onMouseEnter={() => setActiveCategory(String(cat.id))}
                                        type="button"
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>

                            <div className="category-dropdown__content-wrapper">
                                <div className="category-dropdown__content">
                                    {brands.map(b => (
                                        <button
                                            key={b.id}
                                            className="category-dropdown__brand-item"
                                            onClick={() => onClickBrand(b.name)}
                                        >
                                            {b.name}
                                        </button>
                                    ))}
                                </div>
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
                    <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow>
                        <div style={{ cursor: 'pointer' }}>
                            <Avatar src={user?.avatar || defaultAvatar} />
                            <span className="header__user-name">{user?.full_name || 'User'}</span>
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
