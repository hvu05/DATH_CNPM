import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './auth.scss';
import { userAPI } from '@/services/user/profiles/user.profiles.api';
import { message } from 'antd';
import axios from 'axios';

export const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

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
        const obj: Partial<IUser> = {
            password: password
        }
        try {
            const res = await axios.put<ApiResponse<IUser>>('/users/profile', obj);

            if(res.data.success) message.success('Thay đổi mật khẩu thành công')
            navigate('/'); // Điều hướng đến trang chính
        } catch (error) {
            message.error('Thay đổi mật khẩu thất bại')
            console.log('Thay đổi mật khẩu thất bại', error)
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
                        onChange={e => setPassword(e.target.value)} // Cập nhật password
                    />
                    <input
                        type="password"
                        className="auth__input"
                        placeholder="Xác nhận mật khẩu"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)} // Cập nhật confirmPassword
                    />
                    {error && <div className="auth__error">{error}</div>}{' '}
                    {/* Hiển thị lỗi nếu có */}
                    <button className="auth__button" type="submit">
                        Tiếp theo
                    </button>
                </form>
            </div>
        </div>
    );
};
