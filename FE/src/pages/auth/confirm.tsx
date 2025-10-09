import { useNavigate } from 'react-router'
import './confirm.scss'
export const ConfirmPage = () => {
    const navigate = useNavigate();
    const onSubmit = () => {
        // assume success 
        navigate('/otp');
    }
    return (
        <>
            <div className="confirm-container">
                <div className="confirm">
                    <div className="confirm__title">
                        Xác nhận tài khoản
                    </div>
                    <form action="" className="confirm__form" onSubmit={onSubmit}>
                        <input type="text" className="confirm__input" placeholder='Số điện thoại' />
                        <button className="confirm__button" type='submit'>Tiếp theo</button>
                    </form>
                </div>
            </div>
        </>
    )
}