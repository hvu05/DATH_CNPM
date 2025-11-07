import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { authAPI } from "@/services/auth/auth.service";
import { StepOneForm } from "@/components/auth/register/step.one";
import { StepTwoForm } from "@/components/auth/register/step.two";
import { type RegisterRequest } from "@/types/auth/auth.types";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1); // 1: form, 2: verify otp
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // OTP
  const [otpCode, setOtpCode] = useState("");
  const [emailForOtp, setEmailForOtp] = useState("");

  // Form data
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const validateForm = () => {
    if (!formData.full_name.trim()) {
      setError("Vui lòng nhập họ và tên");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Vui lòng nhập email");
      return false;
    }
    if (!formData.password) {
      setError("Vui lòng nhập mật khẩu");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return false;
    }
    if (formData.phone && formData.phone.length !== 10) {
      setError("Số điện thoại phải có 10 chữ số");
      return false;
    }
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      await authAPI.sendOtp({ email: formData.email });
      setEmailForOtp(formData.email);
      setStep(2);
      setSuccess("OTP đã được gửi đến email của bạn");
    } catch (err: any) {
      setError(err.response.data.message || "Gửi OTP thất bại");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtpAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const registerData: RegisterRequest = {
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,
        otp_code: otpCode,
      };

      await authAPI.register(registerData);
      setSuccess(
        "Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập..."
      );
      setTimeout(() => navigate("/login"), 1000);
    } catch (err: any) {
      setError(err.response.data.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await authAPI.sendOtp({ email: emailForOtp });
      setSuccess("OTP đã được gửi lại");
    } catch (err: any) {
      setError(err.response.data.message || "Gửi OTP thất bại");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    setStep(1);
    setError("");
    setSuccess("");
    setOtpCode("");
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-red-200">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-left">
          {step === 1 ? "Đăng ký tài khoản" : "Xác minh email"}
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {success}
          </div>
        )}

        {step === 1 && (
          <StepOneForm
            sendOtp={sendOtp}
            formData={formData}
            handleInputChange={handleInputChange}
            loading={loading}
          />
        )}

        {step === 2 && (
          <StepTwoForm
            otpCode={otpCode}
            emailForOtp={emailForOtp}
            verifyOtpAndRegister={verifyOtpAndRegister}
            goBack={goBack}
            loading={loading}
            resendOtp={resendOtp}
            setOtpCode={setOtpCode}
          />
        )}

        <div className="mt-6 text-center pt-6 border-t border-gray-200">
          <span className="text-gray-600 text-sm">Đã có tài khoản? </span>
          <Link
            to="/login"
            className="text-red-500 font-medium hover:text-red-600 transition-colors text-sm"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};
