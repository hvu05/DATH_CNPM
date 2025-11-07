import { Link } from 'react-router'
import { useState } from 'react'
import { authAPI, setTokens } from '@/services/auth/auth.service'
import './auth.scss'
import { getProfileAPI } from '@/services/global'

const RouteMapping: Record<Role, string> = {
    'ADMIN': '/admin',
    'CUSTOMER': '/',
    'STAFF': '/seller'
}

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const onSubmitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authAPI.login({ email, password });
            if (response && response.data) {
                setTokens(response.data);
            }
            const user = await getProfileAPI();

            window.location.href = RouteMapping[user.data?.role ?? 'CUSTOMER'];

        } catch (err: any) {
            setError(err.response?.data?.message || 'Đăng nhập thất bại');
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="auth-container">
            <div className="auth">
                <h1 className="auth__title">Đăng nhập</h1>
                {error && <div className="auth__error">{error}</div>}
                <form className="auth__form" onSubmit={onSubmitForm}>
                    <input
                        type="email"
                        className="auth__input"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        className="auth__input"
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="auth__button" disabled={loading}>
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>
                </form>
                <div className="auth__footer">
                    <span className="auth__footer-text">Bạn quên mật khẩu ?</span>
                    <Link to="/user-confirm" className="auth__footer-link">
                        Đặt lại mật khẩu
                    </Link>
                    <span className="auth__footer-text">Bạn chưa có tài khoản ?</span>
                    <Link to="/register" className="auth__footer-link">
                        Đăng kí
                    </Link>
                </div>
            </div>
        </div>
    )
}
