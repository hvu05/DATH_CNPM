import React, { useState, useEffect } from 'react';
import { useClientProfile } from '@/hooks/client/useClientProfile';
import defaultAvatar from '@/assets/seller/user.svg';
import '@/pages/client/profile/edit.profile.scss';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UploadImage } from '@/components/admin/upload.img'; // Đảm bảo import UploadImage đúng đường dẫn
import { uploadImageAPI } from '@/services/global'; // Đảm bảo import đúng API upload ảnh

export const EditProfileClient = () => {
    const navigate = useNavigate();
    const { data: profile, loading, updating, updateProfile } = useClientProfile();
    const cloudinary = import.meta.env.VITE_CLOUDINARY_NAME;
    const [form, setForm] = useState({
        full_name: '',
        phone: '',
        // avatar: ''
    });
    const [fileList, setFileList] = useState<any[]>([]); // Dùng để lưu trữ ảnh đã chọn

    useEffect(() => {
        if (profile) {
            setForm({
                full_name: profile.full_name ?? '',
                phone: profile.phone ?? '',
                // avatar: profile.avatar ??''
            });
            if (profile.avatar) {
                setFileList([
                    {
                        url: profile.avatar, // Đảm bảo avatar là URL ảnh hoặc đường dẫn
                        name: profile.avatar,
                        uid: profile.avatar, // Dùng UID là avatar cho tính duy nhất
                    },
                ]);
            }
        }
    }, [profile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            let avatarUrl: string | null = null;

            // Kiểm tra nếu người dùng đã chọn avatar mới
            if (fileList && fileList[0] && fileList[0].originFileObj) {
                // Upload ảnh mới lên Cloudinary
                const uploadResult = await uploadImageAPI(fileList[0].originFileObj, 'avatar');
                avatarUrl = uploadResult.data?.public_id ?? null;

                // Cập nhật fileList với URL hoặc public_id của ảnh
                setFileList([
                    {
                        ...fileList[0],
                        url: `https://res.cloudinary.com/${cloudinary}/image/upload/${avatarUrl}.jpg`, // Sử dụng URL Cloudinary hoàn chỉnh
                        uid: avatarUrl, // Cập nhật UID để giữ tính duy nhất
                        name: 'avatar', // Tên ảnh (có thể tùy chỉnh)
                    },
                ]);
            }

            // Cập nhật thông tin profile với dữ liệu mới và avatar (nếu có)

            const updatedProfile = {
                ...form,
                ...(avatarUrl && { avatar: avatarUrl }),
            };
            console.log('updatedProfile', updatedProfile);
            await updateProfile(updatedProfile); // Cập nhật dữ liệu profile
            message.success('Cập nhật thành công!');
            navigate('/client'); // Điều hướng lại trang sau khi cập nhật thành công
        } catch (error) {
            console.error('Error updating profile:', error);
            message.error('Đã xảy ra lỗi khi cập nhật thông tin');
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="client-edit-profile">
            <h1 className="client-edit-profile__title">Thông tin cá nhân</h1>
            <div className="client-edit-profile__card">
                <div className="client-edit-profile__main">
                    <div className="client-edit-profile__avatar-container">
                        <img
                            src={`${cloudinary}/${profile?.avatar}`}
                            alt="avatar"
                            className="client-edit-profile__avatar"
                        />
                    </div>

                    <UploadImage maxImage={1} fileList={fileList} setFileList={setFileList} />

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
                            className="client-edit-profile__input "
                            onChange={handleChange}
                            value={form.phone}
                            name="phone"
                        />
                    </div>

                    {/* <div className="client-edit-profile__row">
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
                    </div> */}

                    <div className="client-edit-profile__row">
                        <label className="client-edit-profile__label">Email</label>
                        <input
                            name="email"
                            type="email"
                            value={profile?.email ?? ''}
                            onChange={handleChange}
                            className="client-edit-profile__input disabled"
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
