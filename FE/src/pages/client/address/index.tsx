import default_address from "@/assets/client/home.svg";
import './index.scss'

export const ClientAddress = () => {
    return (
        <div className="client-address__list">
            <div className="client-address__item">
                <div className="client-address__product-info">
                    <div className="client-address__img-container">
                        <img className="client-address__img" src={default_address} alt='address_img' />
                    </div>
                    <div className="client-address__details">
                        <div className="client-address__name">Tên khách hàng</div>
                        <div className="client-address__phone">Số điện thoai: 0123456789</div>
                        <div className="client-address__detailaddress">Số 123, đường ABC, phường ABC, tỉnh ABC</div>
                    </div>
                </div>
                <div className="client-address__set-default">
                    <button className="bg-transparent
                                       hover:bg-red-700
                                       text-red-600 font-semibold
                                       hover:text-white py-2 px-4
                                       border-2
                                       border-red-500
                                       hover:border-transparent
                                       rounded-xl">
                        Đặt làm mặc định</button>
                </div>
            </div>



            <button className="bg-red-600
                                        w-40
                                       hover:bg-red-700
                                       text-white py-2 px-4 font-semibold
                                       hover:text-white py-2 px-4
                                       border-2
                                       border-red-500
                                       hover:border-transparent
                                       rounded-xl">
                Thêm địa chỉ</button>
        </div>
    )
}