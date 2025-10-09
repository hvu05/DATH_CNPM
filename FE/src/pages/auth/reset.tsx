import { useState } from "react";
import { useNavigate } from "react-router"
import './reset.scss'

export const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('')
    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // navigate('/');
        console.log(password)
    }

    return (
        <>
            <div className="reset-pass-container">
                <div className="reset-pass">
                    <div className="reset-pass__title">
                        Đặt lại mật khẩu
                    </div>
                    <form
                        className="reset-pass__form"
                        onSubmit={onSubmit}
                    >
                        <input
                            type="password" className="reset-pass__password reset-pass__input"
                            placeholder="Nhập mật khẩu mới"
                            value={password}
                        />
                        <input
                            type="password" className="reset-pass__repass reset-pass__input" placeholder="Xác nhận mật khẩu"
                        />
                        <button
                            className="reset-pass__button"
                            type="submit"
                        >
                            Tiếp theo
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}