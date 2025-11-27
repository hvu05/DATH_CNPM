import React, { useState } from 'react';
import './index.scss';
import { useGetClientAddress } from '@/hooks/client/useClientAddress';
import type { Address } from '@/types/clients/client.address.types';

interface ChangeAddressProps {
    setFormChangeAddress: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedAddress: React.Dispatch<React.SetStateAction<Address | null>>;
}

export const ChangeAddressPage: React.FC<ChangeAddressProps> = ({
    setFormChangeAddress,
    setSelectedAddress,
}) => {
    const [refresh, setRefresh] = useState<boolean>(true);
    const { data: address, loading: loadingAddress } = useGetClientAddress(refresh);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

    if (loadingAddress) return <p>Loading ...</p>;

    const handleAddressSelect = (adr: Address) => {
        // Cập nhật địa chỉ đã chọn
        setSelectedAddress(adr);
        setSelectedAddressId(adr.id); // Lưu lại id địa chỉ đã chọn
    };

    return (
        <div className="change-address-container">
            <div className="bgr-opacity"></div>
            <div className="change-address">
                <h1>Chọn địa chỉ giao hàng</h1>
                <ul>
                    {address.map(adr => (
                        <li key={adr.id}>
                            <div className="flex">
                                <div className="flex items-center h-5">
                                    <input
                                        id={`radio-${adr.id}`} // Sử dụng radio button thay vì checkbox
                                        type="radio"
                                        name="address" // Tất cả radio buttons có cùng name sẽ chỉ cho phép chọn 1
                                        value={adr.id}
                                        checked={selectedAddressId === adr.id} // Kiểm tra xem địa chỉ này có được chọn không
                                        onChange={() => handleAddressSelect(adr)} // Cập nhật địa chỉ đã chọn
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                </div>
                                <div className="ms-2 text-sm">
                                    <label
                                        htmlFor={`radio-${adr.id}`}
                                        className="font-medium text-gray-900 dark:text-gray-300"
                                    >
                                        {adr.receive_name} - {adr.phone}
                                    </label>
                                    <p
                                        id="helper-radio-text"
                                        className="text-xs font-normal text-gray-500 dark:text-gray-300"
                                    >
                                        {adr.detail + ' - ' + adr.ward + ' - ' + adr.province}
                                    </p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>

                <div
                    className="btn-rebuy change-address__btn-save"
                    onClick={() => setFormChangeAddress(false)}
                >
                    Lưu địa chỉ
                </div>
                <div
                    className="btn-processing change-address__btn-cancel"
                    onClick={() => setFormChangeAddress(false)}
                >
                    Hủy
                </div>
            </div>
        </div>
    );
};
