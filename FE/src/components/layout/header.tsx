// FE/src/components/common/Header.tsx
import './header.scss';
import homeIcon from '@/assets/home-icon.svg';
import menuIcon from '@/assets/menu-icon.svg';
import searchIcon from '@/assets/search-icon.svg';
import cartIcon from '@/assets/cart-icon.svg';
import defaultAvatar from '@/assets/default-avatar-icon.svg';
import { Link, useNavigate } from 'react-router-dom';
import { Dropdown, Avatar, Badge, message } from 'antd';
import type { MenuProps } from 'antd';
import {
    UserOutlined,
    LogoutOutlined,
    SettingOutlined,
    MobileOutlined,
    LaptopOutlined,
    TabletOutlined,
    CustomerServiceOutlined,
    ClockCircleOutlined,
} from '@ant-design/icons';

import { useAuthContext } from '@/contexts/AuthContext';
import { removeTokens } from '@/services/auth/auth.service';
import { useCart } from '@/contexts/CartContext';
import React, { useState, useEffect, useRef } from 'react';

const megaMenuData = [
    {
        id: 'phones',
        name: 'Điện thoại',
        icon: <MobileOutlined />,
        content: {
            columns: [
                {
                    title: 'Thương hiệu',
                    items: [
                        { name: 'iPhone', link: '/search?search=iPhone' },
                        { name: 'Samsung', link: '/search?search=Samsung' },
                        { name: 'Xiaomi', link: '/search?search=Xiaomi' },
                        { name: 'OPPO', link: '/search?search=OPPO' },
                    ],
                },
                {
                    title: 'Mức giá',
                    items: [
                        { name: 'Dưới 5 triệu', link: '/search?search=phone&max_price=5000000' },
                        {
                            name: 'Từ 5 - 10 triệu',
                            link: '/search?search=phone&min_price=5000000&max_price=10000000',
                        },
                        { name: 'Trên 20 triệu', link: '/search?search=phone&min_price=20000000' },
                    ],
                },
            ],
        },
    },
    {
        id: 'laptops',
        name: 'Máy tính',
        icon: <LaptopOutlined />,
        content: {
            columns: [
                {
                    title: 'Thương hiệu',
                    items: [
                        { name: 'MacBook', link: '/search?search=MacBook' },
                        { name: 'Dell', link: '/search?search=Dell' },
                        { name: 'Asus', link: '/search?search=Asus' },
                        { name: 'HP', link: '/search?search=HP' },
                    ],
                },
            ],
        },
    },
    {
        id: 'watches',
        name: 'Đồng hồ',
        icon: <ClockCircleOutlined />,
        content: {
            columns: [
                {
                    title: 'Loại đồng hồ',
                    items: [
                        { name: 'Apple Watch', link: '/search?search=Apple+Watch' },
                        { name: 'Samsung Watch', link: '/search?search=Galaxy+Watch' },
                        { name: 'Đồng hồ thông minh', link: '/search?search=Smartwatch' },
                    ],
                },
            ],
        },
    },
    {
        id: 'tablets',
        name: 'Máy tính bảng',
        icon: <TabletOutlined />,
        content: {
            columns: [
                {
                    title: 'Gợi ý',
                    items: [
                        { name: 'iPad', link: '/search?search=iPad' },
                        { name: 'Samsung Tab', link: '/search?search=Samsung+Tab' },
                    ],
                },
            ],
        },
    },
    {
        id: 'accessories',
        name: 'Phụ kiện',
        icon: <CustomerServiceOutlined />,
        content: {
            columns: [
                {
                    title: 'Âm thanh',
                    items: [
                        { name: 'Tai nghe', link: '/search?search=Tai+nghe' },
                        { name: 'Loa', link: '/search?search=Loa' },
                    ],
                },
                {
                    title: 'Khác',
                    items: [
                        { name: 'Sạc dự phòng', link: '/search?search=Sạc' },
                        { name: 'Cáp sạc', link: '/search?search=Cáp' },
                    ],
                },
            ],
        },
    },
];

export const Header = () => {
    const navigate = useNavigate();
    const { user, setUser, isLoggedIn, setIsLoggedIn } = useAuthContext();
    const { cartItems } = useCart();

    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState<string>('phones');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);

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
        else if (key === 'profile') navigate('/client/profile');
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
        ...(user?.role === 'STAFF'
            ? [{ key: 'sellerpage', label: 'Kênh nhân viên', icon: <SettingOutlined /> }]
            : []),
        { type: 'divider' },
        {
            key: 'logout',
            label: 'Đăng xuất',
            icon: <LogoutOutlined />,
            danger: true,
        },
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search?search=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm('');
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsCategoryDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const activeCategoryData = megaMenuData.find(cat => cat.id === activeCategory);

    return (
        <header className="header">
            <div className="header__left">
                <Link to={'/'} className="header__home-link">
                    <img src={homeIcon} alt="Home" />
                </Link>

                {/* CATEGORY DROPDOWN */}
                <div className="category-dropdown" ref={dropdownRef}>
                    <button
                        className="header__button"
                        onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                    >
                        <img src={menuIcon} alt="Menu" className="header__button-icon" />
                        <span className="header__button-text">Danh mục</span>
                    </button>

                    {isCategoryDropdownOpen && (
                        <div className="category-dropdown__menu">
                            <div className="category-dropdown__categories">
                                {megaMenuData.map(category => (
                                    <button
                                        key={category.id}
                                        className={`category-dropdown__category-item ${activeCategory === category.id ? 'active' : ''}`}
                                        onMouseEnter={() => setActiveCategory(category.id)}
                                    >
                                        <span className="category-dropdown__icon">
                                            {category.icon}
                                        </span>
                                        {category.name}
                                    </button>
                                ))}
                            </div>

                            <div className="category-dropdown__content-wrapper">
                                {activeCategoryData && (
                                    <div className="category-dropdown__content">
                                        {activeCategoryData.content.columns.map((column, index) => (
                                            <div key={index} className="category-dropdown__column">
                                                <h4 className="category-dropdown__column-title">
                                                    {column.title}
                                                </h4>
                                                <ul className="category-dropdown__column-list">
                                                    {column.items.map((item, itemIndex) => (
                                                        <li key={itemIndex}>
                                                            <Link
                                                                to={item.link}
                                                                onClick={() =>
                                                                    setIsCategoryDropdownOpen(false)
                                                                }
                                                            >
                                                                {item.name}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* SEARCH BAR */}
            <form className="header__search" onSubmit={handleSearch}>
                <input
                    type="text"
                    className="header__search-input"
                    placeholder="Bạn tìm gì hôm nay?"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="header__search-icon">
                    <img src={searchIcon} alt="Search" />
                </button>
            </form>

            {/* RIGHT ACTIONS */}
            <div className="header__right">
                <Link to="/cart" className="header__button">
                    <Badge count={totalCartItems} size="small" offset={[0, -2]} showZero={false}>
                        <img src={cartIcon} alt="Cart" className="header__button-icon" />
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
                            className="header__user-info"
                            style={{
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                            }}
                        >
                            <Avatar src={user?.avatar || defaultAvatar} icon={<UserOutlined />} />
                            <span
                                className="header__user-name"
                                style={{
                                    color: 'white',
                                    maxWidth: 100,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {user?.full_name || 'User'}
                            </span>
                        </div>
                    </Dropdown>
                ) : (
                    <div className="header__auth-buttons">
                        <button onClick={() => navigate('/login')} className="header__button">
                            <span className="header__button-text">Đăng nhập</span>
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};
