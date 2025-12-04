import { useAuthContext } from '@/contexts/AuthContext';
import './edit.profile.scss';
import defaultAvatar from '@/assets/default-avatar-icon.svg';
import { useEffect, useState } from 'react';
import { EditOutlined } from '@ant-design/icons';
import { updateProfileSellerAPI } from '@/services/seller/seller.service';
import { App, Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';

export const EditProfilePage = () => {
    const { user, updateUser } = useAuthContext();
    const [fullName, setFullname] = useState<string>(user?.full_name ?? '');
    const [phone, setPhone] = useState<string>(user?.phone ?? '');
    const [loading, setLoading] = useState<boolean>(false);
    const { notification, message } = App.useApp();

    const onSubmit = async () => {
        try {
            setLoading(true);
            const result = await updateProfileSellerAPI(fullName, phone);
            if (result.data) {
                updateUser(result.data);
                message.success('Cập nhật thành công');
            }
        } catch (error: any) {
            setLoading(false);
            console.log(error);
            notification.error({
                message: 'Error',
                description: error.response.data.error,
            });
        }
        setLoading(false);
    };

    useEffect(() => {
        setFullname(user?.full_name ?? '');
        setPhone(user?.phone ?? '');
    }, [user]);

    return (
        <div className="seller-edit-profile">
            <Breadcrumb
                className="text-base"
                items={[
                    {
                        title: <Link to={'/seller'}>Hồ sơ</Link>,
                    },
                    {
                        title: 'Cập nhật',
                    },
                ]}
            />
            <h1 className="seller-edit-profile__title">
                <EditOutlined /> Chỉnh sửa thông tin cá nhân
            </h1>
            <div className="seller-edit-profile__card">
                <div className="seller-edit-profile__main">
                    <div className="seller-edit-profile__avatar-container">
                        <img
                            src={user?.avatar ?? defaultAvatar}
                            alt="avatar"
                            className="seller-edit-profile__avatar"
                        />
                    </div>
                    <div className="seller-edit-profile__row">
                        <label className="seller-edit-profile__label">Họ và tên</label>
                        <input
                            className="seller-edit-profile__input"
                            value={fullName}
                            onChange={e => setFullname(e.target.value)}
                        />
                    </div>
                    <div className="seller-edit-profile__row">
                        <label className="seller-edit-profile__label">Số điện thoại</label>
                        <input
                            className="seller-edit-profile__input"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                        />
                    </div>
                    <div className="seller-edit-profile__row">
                        <label className="seller-edit-profile__label">Email</label>
                        <input
                            className="seller-edit-profile__input disabled"
                            type="email"
                            disabled
                            value={user?.email ?? ''}
                        />
                    </div>
                    <div className="seller-edit-profile__button-container">
                        <button
                            className="seller-edit-profile__button"
                            onClick={onSubmit}
                            disabled={loading}
                        >
                            Cập nhật thông tin
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
