import { useNavigate } from 'react-router';
import defaultAvatar from '@/assets/default-avatar-icon.svg';
import '@/pages/client/profile/index.scss';
// import { useState } from 'react';
import { useClientProfile } from '@/hooks/client/useClientProfile';

export const ProfilePageClient = () => {
    const navigate = useNavigate();

    const cloudinary = import.meta.env.VITE_CLOUDINARY_NAME

    // const [refresh, setRefresh] = useState<boolean>(true)
    const { data: profile, loading: loading } = useClientProfile();

    if(!loading) console.log('user', profile)
    if (loading) return <p>Loading...</p>;
    return (
        <div className="client-profile">
            <h1 className="client-profile__title">Thông tin khách hàng</h1>
            <div className="client-profile__card">
                <div className="client-profile__main">
                    <div className="client-profile__avatar-container">
                        <img className="client-profile__avatar" src={`${cloudinary}/${profile?.avatar}`} alt="avatar" />
                    </div>
                    <div className="client-profile__info-row">
                        <div className="client-profile__label">Họ và tên</div>
                        <div className="client-profile__value">
                            {profile?.full_name ?? 'Chưa có tên'}
                        </div>
                    </div>
                    <div className="client-profile__hr"></div>
                    <div className="client-profile__info-row">
                        <div className="client-profile__label">Số điện thoại</div>
                        <div className="client-profile__value">
                            {profile?.phone ?? 'Chưa có số điện thoại'}
                        </div>
                    </div>
                    <div className="client-profile__hr"></div>
                    <div className="client-profile__info-row">
                        <div className="client-profile__label">Email</div>
                        <div className="client-profile__value">
                            {profile?.email ?? 'Chưa có email'}
                        </div>
                    </div>

                    <div className="client-profile__hr"></div>
                    <div className="client-profile__info-row">
                        <div className="client-profile__label">Tài khoản được tạo ngày</div>
                        <div className="client-profile__value">
                            {profile?.create_at.toLocaleString().split('T')[0] ?? ''}
                        </div>
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
