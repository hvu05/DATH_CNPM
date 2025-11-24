import './header.scss';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Typography } from 'antd';
import type { MenuProps } from 'antd';
import { useAuthContext } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router';

const { Text } = Typography;

export const Header = () => {
    const { isLoggedIn, logout } = useAuthContext();
    const navigate = useNavigate();

    const profileMenu: MenuProps['items'] = [
        ...(!isLoggedIn ? [{ key: 'login', label: 'Đăng nhập' }] : []),
        { type: 'divider' },
        { key: 'logout', danger: true, label: 'Đăng xuất' },
    ];

    const onProfileClick: MenuProps['onClick'] = ({ key }) => {
        if (key === 'login') navigate('/login');
        if (key === 'logout') logout();
    };

    return (
        <header
            className="seller-header"
            style={{
                zIndex: '100',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
            }}
        >
            <div className="seller-header__left">
                {/* Empty space for balance */}
            </div>

            <div className="seller-header__right">
                <Dropdown
                    menu={{ items: profileMenu, onClick: onProfileClick }}
                    trigger={['click']}
                >
                    <a onClick={e => e.preventDefault()}>
                        <div className="flex items-center gap-3">
                            <Avatar
                                size={32}
                                icon={<UserOutlined />}
                                style={{
                                    backgroundColor: '#f0f2ff',
                                    borderColor: '#667eea',
                                    borderWidth: 2,
                                    color: '#667eea'
                                }}
                            />
                            <Text
                                className="hidden sm:inline"
                                style={{
                                    color: '#ffffff',
                                    fontWeight: '500'
                                }}
                            >
                                Hello, Seller 🎉
                            </Text>
                        </div>
                    </a>
                </Dropdown>
            </div>
        </header>
    );
};
