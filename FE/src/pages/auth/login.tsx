import { Link, useNavigate } from 'react-router'
import './login.scss'

export const LoginPage = () => {
    const navigate = useNavigate();

    const onSubmitForm = () => {
        // post.... 
        navigate('/');
    }
    return (
        <div className="login-container">
            <div className="login">
                <h1 className="login__title">Đăng nhập</h1>
                <form className="login__form" onSubmit={onSubmitForm}>
                    <input type="text" className="login__input" placeholder="Số điện thoại" />
                    <input type="password" className="login__input" placeholder="Mật khẩu" />
                    <button type="submit" className="login__button">
                        Đăng nhập
                    </button>
                </form>
                <div className="login__footer">
                    <span className="login__footer-text">Bạn quên mật khẩu?</span>
                    <Link to="/user-confirm" className="login__footer-link">
                        Đặt lại mật khẩu
                    </Link>
                </div>
            </div>
        </div>
    )
}
