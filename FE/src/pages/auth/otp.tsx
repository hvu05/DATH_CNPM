import { useNavigate } from "react-router"
import './otp.scss'
import { useState } from "react";

export const OtpPage = () => {
    const navigate = useNavigate();

    const [otp, setOtp] = useState<string>('');
    const onSubmit = (e: React.FormEvent) => {
        // navigate('/reset-pass')
        e.preventDefault();
        console.log(otp);
    }
    return (
        <>
            <div className="otp-container">
                <div className="otp">
                    <div className="otp__title">
                        Nhập mã OTP
                    </div>
                    <form className="otp__form">
                        <input
                            type="text"
                            className="otp__input"
                            placeholder="Nhập mã OTP"
                            onChange={(e) => setOtp(e.target.value)}
                        />
                        <button
                            className="otp__button"
                            onClick={onSubmit}
                            type="submit"
                        >
                            Tiếp theo</button>
                    </form>
                    <div className="otp__footer">
                        <span className="otp__footer-text">
                            Bạn chưa nhận được otp?
                        </span>
                        <span className="otp__footer-link">
                            Gửi lại mã
                        </span>
                    </div>
                </div>
            </div>
        </>
    )
}