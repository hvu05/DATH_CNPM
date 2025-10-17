import Qr_payment from '@/assets/client/qr_payment.svg'
import './index.scss'

export const PaymentClient = () => {

    return (
        <div className='payment-container'>
            <h1>Vui lòng quét mã thanh toán để hoàn tất đơn hàng</h1>
            <img src={Qr_payment} alt='qr_payment' />
            <div className='payment-container__alert'>Thông tin chuyển khoản ngân hàng</div>
            <h2>Vui lòng không thay đổi nội dung chuyển khoản</h2>

            <div className='payment-container__info'>
                <div className='bank-info-left'>
                    <ul>
                        <li>Tên tài khoản: </li>
                        <li>Số tài khoản: </li>
                        <li>Ngân hàng: </li>
                        <li>Số tiền: </li>
                    </ul>
                </div>

                <div className='bank-info-right'>
                    <ul>
                        <li>Nguyễn Văn A</li>
                        <li>123456789</li>
                        <li>BIDV</li>
                        <li>400.000VNĐ</li>
                    </ul>
                </div>
            </div>
        </div>

    )
}