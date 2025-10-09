import './auth.scss'

export const LoginPage = () => {
    return (
        <>
            <div className='login'>
                <div className="login__title">
                    Đăng nhập
                </div>
                <div className="login__input">
                    <input type="text" className="login__phone" placeholder='Số điện thoại' />
                    <input type="text" className="login__password"
                        placeholder='Mật khẩu' />
                </div>
                <button className="login__button">Đăng nhập</button>
                <div className="login__note">
                    <span className="login__text">Bạn quên mật khẩu?</span>
                    <span className='login__reset'>Đặt lại mật khẩu</span>
                </div>
            </div>
        </>
    )
}