import { useLocation, useNavigate } from 'react-router-dom';
import './auth.scss';
import { useEffect, useState } from 'react';
import { authAPI } from '@/services/auth/auth.service';
import { App } from 'antd';

export const OtpPage = () => {
    const navigate = useNavigate();

    const [otp, setOtp] = useState<string>('');
    const location = useLocation();
    const email = location.state?.email;
    const { message } = App.useApp();
    const [countdown, setCountdown] = useState<number>(0);
    const [resending, setResending] = useState<boolean>(false);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: verify OTP
        try {
            const result = await authAPI.verifyOtp({
                email: email,
                otp_code: otp,
            });
            if (result.success) {
                navigate('/reset-pass', {
                    state: {
                        email: email,
                        otp_code: otp,
                    },
                });
            }
        } catch (error: any) {
            message.error('OTP không chính xác');
        }
    };

    const handleResendOtp = async () => {
        if (countdown > 0 || resending) return;

        setResending(true);
        try {
            await authAPI.sendOtp({ email, isRegister: false });
            message.success('Đã gửi lại mã OTP');
            setCountdown(30); // Start 30s countdown
        } catch (error: any) {
            message.error('Không thể gửi lại OTP, vui lòng thử lại');
        } finally {
            setResending(false);
        }
    };

    useEffect(() => {
        if (countdown <= 0) return;
        const timer = setInterval(() => {
            setCountdown(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [countdown]);
    return (
        <>
            <div className="auth-container">
                <div className="auth">
                    <div className="auth__title">Nhập mã OTP</div>
                    <form className="auth__form">
                        <input
                            type="text"
                            className="auth__input"
                            placeholder="Nhập mã OTP"
                            onChange={e => setOtp(e.target.value)}
                        />
                        <button className="auth__button" onClick={onSubmit} type="submit">
                            Tiếp theo
                        </button>
                    </form>
                    <div className="auth__footer">
                        <span className="auth__footer-text">Bạn chưa nhận được OTP?</span>
                        {countdown > 0 ? (
                            <span className="auth__footer-link auth__footer-link--disabled">
                                Gửi lại sau {countdown}s
                            </span>
                        ) : (
                            <span
                                className="auth__footer-link auth__footer-link--black"
                                onClick={handleResendOtp}
                                style={{ cursor: resending ? 'not-allowed' : 'pointer' }}
                            >
                                {resending ? 'Đang gửi...' : 'Gửi lại mã'}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
