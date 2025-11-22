import { useNavigate } from 'react-router-dom';
import './auth.scss';
export const ConfirmPage = () => {
    const navigate = useNavigate();
    const onSubmit = () => {
        // assume success
        navigate('/otp');
    };
    return (
        <>
            <div className="auth-container">
                <div className="auth">
                    <div className="auth__title">Xác nhận tài khoản</div>
                    <form action="" className="auth__form" onSubmit={onSubmit}>
                        <input type="text" className="auth__input" placeholder="Số điện thoại" />
                        <button className="auth__button" type="submit">
                            Tiếp theo
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};
