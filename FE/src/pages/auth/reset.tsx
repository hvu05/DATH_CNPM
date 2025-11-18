import { useState } from 'react';
import { useNavigate } from 'react-router';
import './auth.scss';

export const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        navigate('/');
        console.log(password);
    };

    return (
        <>
            <div className="auth-container">
                <div className="auth">
                    <div className="auth__title">Đặt lại mật khẩu</div>
                    <form className="auth__form" onSubmit={onSubmit}>
                        <input
                            type="password"
                            className="auth__input"
                            placeholder="Nhập mật khẩu mới"
                            value={password}
                        />
                        <input
                            type="password"
                            className="auth__input"
                            placeholder="Xác nhận mật khẩu"
                        />
                        <button className="auth__button" type="submit">
                            Tiếp theo
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};
