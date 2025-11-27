import { useNavigate } from 'react-router';
import './auth.scss';
import { authAPI } from '@/services/auth/auth.service';
import type { SendOtpRequest } from '@/types/auth/auth.types';
import { useState } from 'react';

export const ConfirmPage = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null); // Lưu trữ lỗi nếu có
    const navigate = useNavigate();

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };
    const onSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!email) {
            setError('Email không được để trống');
            return;
        }

        const obj: SendOtpRequest = {
            email,
        };

        try {
            const res = await authAPI.sendOtp(obj);
            if (res.success) {
                navigate('/otp');
            } else {
                setError(res.message || 'Có lỗi xảy ra');
            }
        } catch (error) {
            setError('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth">
                <div className="auth__title">Xác nhận tài khoản</div>
                <form className="auth__form" onSubmit={onSubmit}>
                    <input
                        type="text"
                        className="auth__input"
                        placeholder="Địa chỉ email"
                        value={email}
                        onChange={handleEmailChange} // Lắng nghe sự kiện thay đổi của input
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
