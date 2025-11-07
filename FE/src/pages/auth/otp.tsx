import { useNavigate } from "react-router-dom";
import "./auth.scss";
import { useState } from "react";

export const OtpPage = () => {
  const navigate = useNavigate();

  const [otp, setOtp] = useState<string>("");
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(otp);
    navigate("/reset-pass");
  };
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
              onChange={(e) => setOtp(e.target.value)}
            />
            <button className="auth__button" onClick={onSubmit} type="submit">
              Tiếp theo
            </button>
          </form>
          <div className="auth__footer">
            <span className="auth__footer-text">Bạn chưa nhận được otp?</span>
            <span className="auth__footer-link auth__footer-link--black">
              Gửi lại mã
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
