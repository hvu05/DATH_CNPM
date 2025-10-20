interface IProps {
    verifyOtpAndRegister: (e: React.FormEvent) => void;
    emailForOtp: string;
    otpCode: string;
    setOtpCode: (v: string) => void;
    resendOtp: () => void;
    loading: boolean;
    goBack: () => void;
}

export const StepTwoForm = (props: IProps) => {
    const { verifyOtpAndRegister, emailForOtp, otpCode, setOtpCode, resendOtp, loading, goBack } = props;
    return (
        <>
            <form onSubmit={verifyOtpAndRegister} className="space-y-4">
                <div className="text-center mb-4">
                    <p className="text-gray-600 mb-2">
                        OTP đã được gửi đến:
                    </p>
                    <p className="font-medium text-gray-800">
                        {emailForOtp}
                    </p>
                </div>

                <div>
                    <input
                        type="text"
                        className="w-full px-4 py-3 border-2 border-red-200 rounded-lg focus:outline-none focus:border-red-400 transition-colors text-gray-700 placeholder-gray-400 text-center text-xl tracking-widest"
                        placeholder="Nhập mã OTP (6 ký tự)"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                        maxLength={6}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-medium py-3 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                >
                    {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                </button>

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={resendOtp}
                        disabled={loading}
                        className="flex-1 bg-gray-500 text-white font-medium py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                        Gửi lại OTP
                    </button>
                    <button
                        type="button"
                        onClick={goBack}
                        className="flex-1 bg-transparent text-red-500 font-medium py-2 rounded-lg hover:bg-red-50 transition-colors border border-red-500 text-sm"
                    >
                        Quay lại
                    </button>
                </div>
            </form>
        </>
    )
}