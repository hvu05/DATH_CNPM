import './index.scss';
import { QRCodeSVG } from 'qrcode.react';
import { useLocation } from 'react-router-dom';

export const PaymentClient = () => {
    const location = useLocation();

    const { qrUrl } = location.state || '';
    return (
        <div className="payment-container">
            <h1>Vui lòng quét mã thanh toán để hoàn tất đơn hàng</h1>

            <h2>Vui lòng không thay đổi nội dung chuyển khoản</h2>

            <QRCodeSVG
                value={qrUrl}
                width={200} // Đặt chiều rộng của mã QR
                height={200} // Đặt chiều cao của mã QR
                fgColor="#000000" // Màu của mã QR (màu của các ô trong mã)
                bgColor="#ffffff" // Màu nền của mã QR
            />
            <div className="payment-container__info">
                <div className="bank-info-left">
                    <ul>
                        <li>Tên tài khoản: </li>
                        <li>Số tài khoản: </li>
                        <li>Ngân hàng: </li>
                        <li>Số tiền: </li>
                    </ul>
                </div>

                <div className="bank-info-right">
                    <ul>
                        <li>Nguyễn Văn A</li>
                        <li>123456789</li>
                        <li>BIDV</li>
                        <li>400.000VNĐ</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
