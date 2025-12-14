import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './auth.scss';
import { userAPI } from '@/services/user/profiles/user.profiles.api';
import { App, message } from 'antd';
import axios from 'axios';
import { authAPI } from '@/services/auth/auth.service';
import { delay } from '@/helpers/seller/helper';

export const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { message } = App.useApp();
    const location = useLocation();
    const { email, otp_code } = location.state || {};

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }
        if (password !== confirmPassword) {
            setError('Mật khẩu và xác nhận mật khẩu không khớp');
            return;
        }

        setError(null); // Xóa lỗi nếu mọi thứ hợp lệ
        //TODO: gọi api thay đổi mật khẩu
        // const obj: Partial<IUser> = {
        //     password: password,
        // };
        try {
            const result = await authAPI.changePassword({
                email: email,
                otp_code: otp_code,
                new_password: password,
            });
            if (result.success) {
                message.success('Đổi mật khẩu thành công');
                delay(1000);
                navigate('/login'); // Điều hướng đến trang chính
            }
            // const res = await axios.put<ApiResponse<IUser>>('/users/profile', obj);

            // if (res.data.success) message.success('Thay đổi mật khẩu thành công');
        } catch (error) {
            message.error('Thay đổi mật khẩu thất bại');
            console.log('Thay đổi mật khẩu thất bại', error);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth">
                <div className="auth__title">Đặt lại mật khẩu</div>
                <form className="auth__form" onSubmit={onSubmit}>
                    <input
                        type="password"
                        className="auth__input"
                        placeholder="Nhập mật khẩu mới"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <input
                        type="password"
                        className="auth__input"
                        placeholder="Xác nhận mật khẩu"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                    />
                    {error && <div className="auth__error">{error}</div>}{' '}
                    <button className="auth__button" type="submit">
                        Tiếp theo
                    </button>
                </form>
            </div>
        </div>
    );
};
