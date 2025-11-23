import Tick from '@/assets/client/tick.svg';
import './index.scss';
import { useNavigate } from 'react-router';

export const OrderSuccess = () => {
    const navigate = useNavigate();
    return (
        <div className="order-success-container">
            <img src={Tick} alt="Tick" />
            <h1>Chúc mừng bạn đã đặt hàng thành công</h1>
            <p>
                Vui mắc thắc về đơn hàng quý khách vui vòng liên hệ hotline hoặc hệ thống cửa hàng
                gần nhất
            </p>
            <div style={{display: 'flex', gap: '10px'}}>
                <div
                    className="btn-rebuy order-success-container__btn"
                    onClick={() => navigate('/')}
                >
                    Trang chủ
                </div>
                <div
                    className="btn-rebuy order-success-container__btn"
                    onClick={() => navigate('/client/my-orders')}
                >
                    Lịch sử mua hàng
                </div>
            </div>
        </div>
    );
};
