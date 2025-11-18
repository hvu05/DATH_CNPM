import { useNavigate } from 'react-router';
import defaultAvatar from '@/assets/default-avatar-icon.svg';
import '@/pages/client/profile/index.scss';

export const ProfilePageClient = () => {
    const navigate = useNavigate();
    return (
        <div className="client-profile">
            <h1 className="client-profile__title">Thông tin khách hàng</h1>
            <div className="client-profile__card">
                <div className="client-profile__main">
                    <div className="client-profile__avatar-container">
                        <img className="client-profile__avatar" src={defaultAvatar} alt="avatar" />
                    </div>
                    <div className="client-profile__info-row">
                        <div className="client-profile__label">Họ và tên</div>
                        <div className="client-profile__value">Tên khach hang</div>
                    </div>
                    <div className="client-profile__hr"></div>
                    <div className="client-profile__info-row">
                        <div className="client-profile__label">Số điện thoại</div>
                        <div className="client-profile__value">012345678</div>
                    </div>
                    <div className="client-profile__hr"></div>
                    <div className="client-profile__info-row">
                        <div className="client-profile__label">Giới tính</div>
                        <div className="client-profile__value">Nam</div>
                    </div>
                    <div className="client-profile__hr"></div>
                    <div className="client-profile__button-container">
                        <button
                            className="client-profile__button"
                            onClick={() => navigate('/client/edit-profile')}
                        >
                            Chỉnh sửa thông tin
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
