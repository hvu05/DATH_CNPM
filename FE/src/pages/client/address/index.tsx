import default_address from '@/assets/client/home.svg';
import './index.scss';
import { useState } from 'react';
import { AddAddress } from '@/components/client/addAddress';
import { useGetClientAddress } from '@/hooks/client/useClientAddress';
import { addressAPI } from '@/services/user/address/user.address.api';
import { message } from 'antd';

export const ClientAddress = () => {
    const [isAddresses, setIsAddresses] = useState<boolean>(false);

    const [refresh, setRefresh] = useState<boolean>(true);
    const { data: address, loading: loadingAddress } = useGetClientAddress(refresh);

    const HandleDeleteAddress = async (id: string) => {
        // if (!window.confirm("Bạn có chắc chắn muốn xóa địa chỉ này không?")) return
        const res = await addressAPI.deleteAddress(id);
        if (res.data) {
            setRefresh(r => !r);
            message.success('Xóa địa chỉ thành công');
        }
    };
    if (loadingAddress) return <p>Loading ...</p>;
    return (
        <div className="client-address__list">
            {address.map(adr => (
                <div className="client-address__item" key={adr.id}>
                    <div className="client-address__product-info">
                        <div className="client-address__img-container">
                            <img
                                className="client-address__img"
                                src={default_address}
                                alt="address_img"
                            />
                        </div>
                        <div className="client-address__details">
                            <div className="client-address__name">Tên khách hàng</div>
                            <div className="client-address__phone">Số điện thoai: 0123456789</div>
                            <div className="client-address__detailaddress">
                                {adr.detail} - {adr.ward} - {adr.province}
                            </div>
                        </div>
                    </div>
                    <div className="client-address__set-default">
                        <button
                            className="bg-transparent
                                hover:bg-red-700
                                text-red-600 font-semibold
                                hover:text-white py-2 px-4
                                border-2
                                border-red-500
                                hover:border-transparent
                                rounded-xl"
                            onClick={() => HandleDeleteAddress(adr.id)}
                        >
                            Xóa
                        </button>
                    </div>
                </div>
            ))}

            <button
                className="bg-red-600
                    w-40
                    hover:bg-red-700
                    text-white py-2 px-4 font-semibold
                    hover:text-white py-2 px-4
                    border-2
                    border-red-500
                    hover:border-transparent
                    rounded-xl"
                onClick={() => setIsAddresses(true)}
            >
                Thêm địa chỉ
            </button>
            {isAddresses && <AddAddress setRefresh={setRefresh} setIsAddresses={setIsAddresses} />}
        </div>
    );
};
