import { useState, useEffect } from 'react';
import { useClientProfile } from '@/hooks/client/useClientProfile';
import defaultAvatar from '@/assets/seller/user.svg';
import '@/pages/client/profile/edit.profile.scss';
import { message } from 'antd';
import { useNavigate } from 'react-router';

export const EditProfileClient = () => {
    const navigate = useNavigate()
    const { data: profile, loading, updating, updateProfile } = useClientProfile();
    const [form, setForm] = useState({
        full_name: '',
        gender: 'male',
        birth_day: '',
        birth_month: '',
        birth_year: '',
        email: '',
    });

    useEffect(() => {
        if (profile) {
            setForm({
                full_name: profile.full_name ?? '',
                gender: 'male', // giả sử chưa có field gender thì default male
                birth_day: '',
                birth_month: '',
                birth_year: '',
                email: profile.email ?? '',
            });
        }
    }, [profile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        await updateProfile(form);
        message.success('Cập nhật thành công!')
        navigate('/client')
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="client-edit-profile">
            <h1 className="client-edit-profile__title">Thông tin cá nhân</h1>
            <div className="client-edit-profile__card">
                <div className="client-edit-profile__main">
                    <div className="client-edit-profile__avatar-container">
                        <img
                            src={profile?.avatar ?? defaultAvatar}
                            alt="avatar"
                            className="client-edit-profile__avatar"
                        />
                    </div>

                    <div className="client-edit-profile__row">
                        <label className="client-edit-profile__label">Họ và tên</label>
                        <input
                            name="full_name"
                            value={form.full_name}
                            onChange={handleChange}
                            className="client-edit-profile__input"
                        />
                    </div>

                    <div className="client-edit-profile__row">
                        <label className="client-edit-profile__label">Số điện thoại</label>
                        <input
                            className="client-edit-profile__input disabled"
                            disabled
                            value={profile?.phone ?? 'Chưa có'}
                        />
                    </div>

                    <div className="client-edit-profile__row">
                        <label className="client-edit-profile__label">Giới tính</label>
                        <div className="client-edit-profile__gender-options">
                            <div className="client-edit-profile__gender-option">
                                <input
                                    type="radio"
                                    id="gender-male"
                                    name="gender"
                                    value="male"
                                    checked={form.gender === 'male'}
                                    onChange={handleChange}
                                />
                                <label htmlFor="gender-male">Nam</label>
                            </div>
                            <div className="client-edit-profile__gender-option">
                                <input
                                    type="radio"
                                    id="gender-female"
                                    name="gender"
                                    value="female"
                                    checked={form.gender === 'female'}
                                    onChange={handleChange}
                                />
                                <label htmlFor="gender-female">Nữ</label>
                            </div>
                        </div>
                    </div>

                    <div className="client-edit-profile__row">
                        <label className="client-edit-profile__label">Email</label>
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            className="client-edit-profile__input"
                        />
                    </div>

                    <div className="client-edit-profile__button-container">
                        <button
                            className="client-edit-profile__button"
                            onClick={handleSubmit}
                            disabled={updating}
                        >
                            {updating ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
