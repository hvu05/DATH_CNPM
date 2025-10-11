import { Link, useNavigate } from 'react-router'
import './auth.scss'

export const LoginPage = () => {
    const navigate = useNavigate();

    const onSubmitForm = () => {
        // post.... 
        navigate('/');
    }
    return (
        <div className="auth-container">
            <div className="auth">
                <h1 className="auth__title">Đăng nhập</h1>
                <form className="auth__form" onSubmit={onSubmitForm}>
                    <input type="text" className="auth__input" placeholder="Số điện thoại" />
                    <input type="password" className="auth__input" placeholder="Mật khẩu" />
                    <button type="submit" className="auth__button">
                        Đăng nhập
                    </button>
                </form>
                <div className="auth__footer">
                    <span className="auth__footer-text">Bạn quên mật khẩu?</span>
                    <Link to="/user-confirm" className="auth__footer-link">
                        Đặt lại mật khẩu
                    </Link>
                </div>
            </div>
        </div>
    )
}
