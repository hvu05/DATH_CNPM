import Tick from '@/assets/client/tick.svg'
import './index.scss'

export const OrderSuccess = () => {
    return (
        <div className="order-success-container">
            <img src={Tick} alt="Tick" />
            <h1>
                Chúc mừng bạn đã đặt hàng thành công
            </h1>
            <p>
                Vui mắc thắc về đơn hàng quý khách vui vòng
                liên hệ hotline hoặc hệ thống cửa hàng gần nhất
            </p>
            <div className='btn-rebuy order-success-container__btn'>Trang chủ</div>
        </div>
    )
}