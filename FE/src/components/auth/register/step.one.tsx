interface IProps {
    sendOtp: (e: React.FormEvent) => void;
    formData: {
        full_name: string;
        email: string;
        password: string;
        confirmPassword: string;
        phone: string;
    };
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    loading: boolean;
}

export const StepOneForm = (props: IProps) => {
    const { sendOtp, formData, handleInputChange, loading } = props;
    return (
        <>
            <form onSubmit={sendOtp} className="space-y-4">
                <div>
                    <input
                        type="text"
                        className="w-full px-4 py-3 border-2 border-red-200 rounded-lg focus:outline-none focus:border-red-400 transition-colors text-gray-700 placeholder-gray-400"
                        placeholder="Họ và tên"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div>
                    <input
                        type="email"
                        className="w-full px-4 py-3 border-2 border-red-200 rounded-lg focus:outline-none focus:border-red-400 transition-colors text-gray-700 placeholder-gray-400"
                        placeholder="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div>
                    <input
                        type="tel"
                        className="w-full px-4 py-3 border-2 border-red-200 rounded-lg focus:outline-none focus:border-red-400 transition-colors text-gray-700 placeholder-gray-400"
                        placeholder="Số điện thoại (không bắt buộc)"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        maxLength={10}
                    />
                </div>

                <div>
                    <input
                        type="password"
                        className="w-full px-4 py-3 border-2 border-red-200 rounded-lg focus:outline-none focus:border-red-400 transition-colors text-gray-700 placeholder-gray-400"
                        placeholder="Mật khẩu"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div>
                    <input
                        type="password"
                        className="w-full px-4 py-3 border-2 border-red-200 rounded-lg focus:outline-none focus:border-red-400 transition-colors text-gray-700 placeholder-gray-400"
                        placeholder="Xác nhận mật khẩu"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-medium py-3 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                >
                    {loading ? 'Đang gửi OTP...' : 'Gửi OTP'}
                </button>
            </form>
        </>
    );
};
