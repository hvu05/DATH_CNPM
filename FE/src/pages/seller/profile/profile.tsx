import { useNavigate } from 'react-router-dom';
import './profile.scss';
import defaultAvatar from '@/assets/default-avatar-icon.svg';
import { UserOutlined } from '@ant-design/icons';
import { useAuthContext } from '@/contexts/AuthContext';

export const ProfilePage = () => {
    const navigate = useNavigate();
    const { user } = useAuthContext();
    return (
        <div className="seller-profile">
            <h1 className="seller-profile__title">
                <UserOutlined /> Thông tin nhân viên
            </h1>
            <div className="seller-profile__card">
                <div className="seller-profile__main">
                    <div className="seller-profile__avatar-container">
                        <img className="seller-profile__avatar" src={defaultAvatar} alt="avatar" />
                    </div>
                    <div className="seller-profile__info-row">
                        <div className="seller-profile__label">Họ và tên</div>
                        <div className="seller-profile__value">
                            {user?.full_name ?? 'Tên nhân viên'}
                        </div>
                    </div>
                    <div className="seller-profile__hr"></div>
                    <div className="seller-profile__info-row">
                        <div className="seller-profile__label">Số điện thoại</div>
                        <div className="seller-profile__value">{user?.phone ?? '0123456789'}</div>
                    </div>
                    <div className="seller-profile__hr"></div>
                    <div className="seller-profile__info-row">
                        <div className="seller-profile__label">Email</div>
                        <div className="seller-profile__value">
                            {user?.email ?? 'example@gmail.com'}
                        </div>
                    </div>
                    <div className="seller-profile__hr"></div>
                    <div className="seller-profile__button-container">
                        <button
                            className="seller-profile__button"
                            onClick={() => navigate('/seller/edit-profile')}
                        >
                            Chỉnh sửa thông tin
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
