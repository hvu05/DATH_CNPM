import './header.scss';
import homeIcon from '@/assets/home-icon.svg';
import menuIcon from '@/assets/menu-icon.svg';
import searchIcon from '@/assets/search-icon.svg';
import cartIcon from '@/assets/cart-icon.svg';
import defaultAvatar from '@/assets/default-avatar-icon.svg';
import { Link, useNavigate } from 'react-router-dom';
import { Dropdown, Avatar, Badge } from 'antd';
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
import type { CartItem } from '@/contexts/CartContext';
import React, { useState, useEffect, useRef } from 'react';

const megaMenuData = [
    {
        id: 'phones',
        name: 'Điện thoại, iPhone',
        icon: <MobileOutlined />,
        content: {
            columns: [
                {
                    title: 'Gợi ý cho bạn',
                    items: [
                        { name: 'iPhone 17 Pro Max', link: '/search?q=iPhone+17' },
                        { name: 'Samsung Galaxy S24 Ultra', link: '/search?q=S24+Ultra' },
                        { name: 'Xiaomi 14 Pro', link: '/search?q=Xiaomi+14' },
                        { name: 'OPPO Reno 11 Pro', link: '/search?q=Reno+11' },
                        { name: 'HONOR Magic 6 Pro', link: '/search?q=Magic+6' },
                        { name: 'iPhone 15 Pro', link: '/search?q=iPhone+15' },
                        { name: 'Sản phẩm khác', link: '/search?q=Điện+thoại' },
                    ],
                },
                {
                    title: 'Thương hiệu khác',
                    items: [
                        { name: 'Nokia', link: '/search?q=Nokia' },
                        { name: 'ASUS', link: '/search?q=ASUS' },
                        { name: 'Realme', link: '/search?q=Realme' },
                        { name: 'Vivo', link: '/search?q=Vivo' },
                        { name: 'OnePlus', link: '/search?q=OnePlus' },
                    ],
                },
            ],
            promo: {
                title: 'Sản phẩm nổi bật',
                image: 'https://via.placeholder.com/150x200', // Thay bằng ảnh thật
                link: '/products/featured-product',
            },
        },
    },
    {
        id: 'laptops',
        name: 'Máy tính',
        icon: <LaptopOutlined />,
        content: {
            columns: [
                {
                    title: 'Laptop theo hãng',
                    items: [
                        { name: 'MacBook', link: '/search?q=MacBook' },
                        { name: 'Dell', link: '/search?q=Dell' },
                        { name: 'HP', link: '/search?q=HP' },
                        { name: 'Lenovo', link: '/search?q=Lenovo' },
                        { name: 'ASUS', link: '/search?q=ASUS' },
                    ],
                },
                {
                    title: 'Linh kiện PC',
                    items: [
                        { name: 'CPU', link: '/search?q=CPU' },
                        { name: 'GPU', link: '/search?q=GPU' },
                        { name: 'RAM', link: '/search?q=RAM' },
                        { name: 'Ổ cứng SSD', link: '/search?q=SSD' },
                    ],
                },
            ],
            promo: null,
        },
    },
    {
        id: 'watches',
        name: 'Apple Watch',
        icon: <ClockCircleOutlined />,
        content: {
            columns: [
                {
                    title: 'Dòng sản phẩm',
                    items: [
                        {
                            name: 'Apple Watch Ultra 2',
                            link: '/search?q=Apple+Watch+Ultra+2',
                        },
                        {
                            name: 'Apple Watch Series 9',
                            link: '/search?q=Apple+Watch+Series+9',
                        },
                        { name: 'Apple Watch SE', link: '/search?q=Apple+Watch+SE' },
                    ],
                },
            ],
            promo: null,
        },
    },
    {
        id: 'tablets',
        name: 'Máy tính bảng',
        icon: <TabletOutlined />,
        content: {
            columns: [
                {
                    title: 'Gợi ý cho bạn',
                    items: [
                        { name: 'iPad Pro M4', link: '/search?q=iPad+Pro+M4' },
                        { name: 'iPad Air M2', link: '/search?q=iPad+Air+M2' },
                        { name: 'Samsung Galaxy Tab S9', link: '/search?q=Galaxy+Tab+S9' },
                    ],
                },
            ],
            promo: null,
        },
    },
    {
        id: 'accessories',
        name: 'Phụ kiện',
        icon: <CustomerServiceOutlined />,
        content: {
            columns: [
                {
                    title: 'Tai nghe',
                    items: [
                        { name: 'AirPods Pro 2', link: '/search?q=AirPods+Pro+2' },
                        { name: 'Sony WH-1000XM5', link: '/search?q=Sony+WH-1000XM5' },
                    ],
                },
                {
                    title: 'Chuột và bàn phím',
                    items: [
                        {
                            name: 'Logitech MX Master 3S',
                            link: '/search?q=Logitech+MX+Master+3S',
                        },
                        { name: 'Keychron K2', link: '/search?q=Keychron+K2' },
                    ],
                },
            ],
            promo: null,
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

    const totalCartItems = cartItems.reduce(
        (total: number, item: CartItem) => total + item.quantity,
        0
    );

    const logout = () => {
        removeTokens();
        setUser(null);
        setIsLoggedIn(false);
        navigate('/login');
    };

    const handleMenuClick: MenuProps['onClick'] = e => {
        const { key } = e;
        if (key === 'logout') logout();
        else if (key === 'profile') navigate('/client');
        else if (key === 'adminpage') navigate('/admin');
        else if (key === 'sellerpage') navigate('/seller');
    };

    const menuItems: MenuProps['items'] = [
        ...(user?.role === 'CUSTOMER'
            ? [{ key: 'profile', label: 'Thông tin cá nhân', icon: <UserOutlined /> }]
            : []),
        ...(user?.role === 'ADMIN'
            ? [
                  {
                      key: 'adminpage',
                      label: 'Quản trị viên',
                      icon: <SettingOutlined />,
                  },
              ]
            : []),
        ...(user?.role === 'STAFF'
            ? [{ key: 'sellerpage', label: 'Nhân viên', icon: <SettingOutlined /> }]
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
            navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
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
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleCategoryDropdownToggle = () => {
        if (!isCategoryDropdownOpen) {
            setActiveCategory('phones');
        }
        setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
    };

    const activeCategoryData = megaMenuData.find(cat => cat.id === activeCategory);

    return (
        <header className="header">
            <div className="header__left">
                <Link to={'/'} className="header__home-link">
                    <img src={homeIcon} alt="Home" />
                </Link>
                <div className="category-dropdown" ref={dropdownRef}>
                    <button className="header__button" onClick={handleCategoryDropdownToggle}>
                        <img src={menuIcon} alt="Menu" className="header__button-icon" />
                        <span className="header__button-text">Danh mục</span>
                    </button>

                    {isCategoryDropdownOpen && (
                        <div className="category-dropdown__menu">
                            <div className="category-dropdown__categories">
                                {megaMenuData.map(category => (
                                    <button
                                        key={category.id}
                                        className={`category-dropdown__category-item ${
                                            activeCategory === category.id ? 'active' : ''
                                        }`}
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
                                    <>
                                        <div className="category-dropdown__content">
                                            {activeCategoryData.content.columns.map(
                                                (column, index) => (
                                                    <div
                                                        key={index}
                                                        className="category-dropdown__column"
                                                    >
                                                        <h4 className="category-dropdown__column-title">
                                                            {column.title}
                                                        </h4>
                                                        <ul className="category-dropdown__column-list">
                                                            {column.items.map((item, itemIndex) => (
                                                                <li key={itemIndex}>
                                                                    <Link
                                                                        to={item.link}
                                                                        onClick={() =>
                                                                            setIsCategoryDropdownOpen(
                                                                                false
                                                                            )
                                                                        }
                                                                    >
                                                                        {item.name}
                                                                    </Link>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )
                                            )}
                                        </div>

                                        {activeCategoryData.content.promo && (
                                            <div className="category-dropdown__promo">
                                                {/*<img src={activeCategoryData.content.promo.image} alt="Promo" /> */}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <form className="header__search" onSubmit={handleSearch}>
                <input
                    type="text"
                    className="header__search-input"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="header__search-icon">
                    <img src={searchIcon} alt="Search" />
                </button>
            </form>

            <div className="header__right">
                <Link to="/cart" className="header__button">
                    <Badge count={totalCartItems} size="small" offset={[0, -2]}>
                        <img src={cartIcon} alt="Cart" className="header__button-icon" />
                    </Badge>
                    <span className="header__button-text">Giỏ hàng</span>
                </Link>

                {isLoggedIn ? (
                    <Dropdown
                        menu={{ items: menuItems, onClick: handleMenuClick }}
                        placement="bottomRight"
                    >
                        <Avatar src={user?.avatar || defaultAvatar} className="header__avatar" />
                    </Dropdown>
                ) : (
                    <button onClick={() => navigate('/login')} className="header__button">
                        <span className="header__button-text">Đăng nhập</span>
                    </button>
                )}
            </div>
        </header>
    );
};
