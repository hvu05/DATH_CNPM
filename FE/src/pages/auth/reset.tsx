import { useState } from 'react';
import { useNavigate } from 'react-router';
import './auth.scss';

export const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const onSubmit = (e: React.FormEvent) => {
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
        navigate('/'); // Điều hướng đến trang chính
        console.log(password); 
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
                        onChange={(e) => setPassword(e.target.value)} // Cập nhật password
                    />
                    <input
                        type="password"
                        className="auth__input"
                        placeholder="Xác nhận mật khẩu"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)} // Cập nhật confirmPassword
                    />
                    {error && <div className="auth__error">{error}</div>} {/* Hiển thị lỗi nếu có */}
                    <button className="auth__button" type="submit">
                        Tiếp theo
                    </button>
                </form>
            </div>
        </div>
    );
};
