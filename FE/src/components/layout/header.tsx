import './header.scss'
import homeIcon from '@/assets/home-icon.svg'
import menuIcon from '@/assets/menu-icon.svg'
import searchIcon from '@/assets/search-icon.svg'
import cartIcon from '@/assets/cart-icon.svg'
import defaultAvatar from '@/assets/default-avatar-icon.svg'
import { Link, useNavigate } from 'react-router'
import { Button, Dropdown, Avatar } from 'antd'
import { UserOutlined, LogoutOutlined, LoginOutlined } from '@ant-design/icons'
import { useAuthContext } from '@/contexts/AuthContext'
import { removeTokens } from '@/services/auth/auth.service'

export const Header = () => {
    const navigate = useNavigate();
    const { user, setUser, isLoggedIn, setIsLoggedIn } = useAuthContext();

    const logout = () => {
        removeTokens();
        setUser(null);
        setIsLoggedIn(false);
        navigate('/login');
    }
    const handleMenuClick = (key: string) => {
        if (key === 'logout') {
            logout();
        } else if (key === 'profile') {
            // Navigate to profile page
        }
    };

    const menuItems = [
        {
            key: 'profile',
            label: 'Thông tin cá nhân',
            icon: <UserOutlined />
        },
        {
            type: 'divider' as const,
        },
        {
            key: 'logout',
            label: 'Đăng xuất',
            icon: <LogoutOutlined />,
            danger: true
        }
    ];

    return (
        <header className="header">
            <div className="header__left">
                <Link to={'/'} className="header__home-link">
                    <img src={homeIcon} alt="Home" />
                </Link>
                <button className="header__button header__button--category">
                    <img src={menuIcon} alt="Menu" className="header__button-icon" />
                    <span className="header__button-text">Danh mục</span>
                </button>
            </div>

            <div className="header__search">
                <input type="text" className="header__search-input" placeholder="Tìm kiếm sản phẩm..." />
                <img src={searchIcon} alt="Search" className="header__search-icon" />
            </div>

            <div className="header__right">
                <button className="header__button header__button--cart">
                    <img src={cartIcon} alt="Cart" className="header__button-icon" />
                    <span className="header__button-text">Giỏ hàng</span>
                </button>

                {isLoggedIn ? (
                    <Dropdown
                        menu={{
                            items: menuItems,
                            onClick: ({ key }) => handleMenuClick(key)
                        }}
                        placement="bottomRight"
                        trigger={['click']}
                    >
                        <Avatar
                            src={user?.avatar || defaultAvatar}
                            className="header__avatar cursor-pointer"
                            size={40}
                            style={{ cursor: 'pointer' }}
                        />
                    </Dropdown>
                ) : (
                    <Button
                        type="primary"
                        icon={<LoginOutlined />}
                        onClick={() => window.location.href = '/login'}
                        className="header__login-btn"
                    >
                        Đăng nhập
                    </Button>
                )}
            </div>
        </header>
    )
}
