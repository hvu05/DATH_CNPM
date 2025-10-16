import './index.scss'
interface AddAddressProps {
    setIsAddresses: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AddAddress: React.FC<AddAddressProps> = ({ setIsAddresses }) => {


    return (
        <div className="address-container">
            <div className="address">
                <h1 className="address__title">Thêm địa chỉ mới</h1>
                <div className='address__close' onClick={() => setIsAddresses(false)}>x</div>
                <form className="address__form" >
                    <input type="text" className="address__input" placeholder="Số điện thoại" />
                    <input type="password" className="address__input" placeholder="Mật khẩu" />
                    <button type="submit" className="address__button">
                        Đăng nhập
                    </button>
                </form>
            </div>
        </div>
    )
}