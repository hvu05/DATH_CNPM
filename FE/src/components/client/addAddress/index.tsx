import { useState, useEffect } from 'react';
import './index.scss';
import type { Province, Ward } from '@/types/clients/client.address.types';
import { addressAPI } from '@/services/user/address/user.address.api';
import { province_api, ward_api } from './addressFake';
import { message } from 'antd';

//! Chỗ này Fake api của Address
interface AddAddressProps {
    setIsAddresses: React.Dispatch<React.SetStateAction<boolean>>;
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AddAddress: React.FC<AddAddressProps> = ({setIsAddresses , setRefresh}) => {
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<string>('');
    const [selectedWard, setSelectedWard] = useState<string>('');
    const [detailAddress, setDetailAddress] = useState<string>('');

    // Fetch provinces on component mount
    useEffect(() => {
        const fetchProvinces = async () => {
            // try {
            //     const data = await addressAPI.getProvinces();
            //     setProvinces(data.provinces); // Assume that data has a `provinces` field
            // } catch (error) {
            //     console.error('Failed to fetch provinces', error);
            // }
            setProvinces(province_api);
        };
        fetchProvinces();
    }, []);

    // Fetch wards when a province is selected
    useEffect(() => {
        const fetchWards = async () => {
            // if (!selectedProvince) return;
            // try {
            //     const data = await addressAPI.getAwards({ codeProvince: selectedProvince });
            //     setWards(data.communes); // Assume that data has a `communes` field
            // } catch (error) {
            //     console.error('Failed to fetch wards', error);
            // }
            setWards(ward_api);
        };
        fetchWards();
    }, [selectedProvince]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        // Handle the form submission logic here (e.g., save the address, etc.)
        console.log('add address', {
            selectedProvince,
            selectedWard,
            detailAddress,
        });
        const objRequest = {
            province: selectedProvince, // Example: "Long An"
            ward: selectedWard, // Example: "Kien Tuong"
            detail: detailAddress,
        };
        try {
            const res = await addressAPI.createANewAddress(objRequest);
            if (res) {
                message.success('Thêm địa chỉ thành công');
                setRefresh(refresh => !refresh)
            }
        } catch (error) {
            message.error('Thêm địa chỉ thất bại');
            console.log(error);
        }

        // Close the address form
        setIsAddresses(false);
    };

    return (
        <div className="address-container">
            <div className="address">
                <h1 className="address__title">Thêm địa chỉ mới</h1>
                <div className="address__close" onClick={() => setIsAddresses(false)}>
                    x
                </div>
                <form className="address__form" onSubmit={handleSubmit}>
                    {/* <input
                        type="text"
                        className="address__input"
                        placeholder="Số điện thoại"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    /> */}

                    <select
                        className="address__input"
                        value={selectedProvince}
                        onChange={e => setSelectedProvince(e.target.value)}
                    >
                        <option value="" disabled>
                            Chọn Tỉnh/Thành phố
                        </option>
                        {provinces.map(province => (
                            <option key={province.code} value={province.name}>
                                {province.name}
                            </option>
                        ))}
                    </select>
                    <select
                        className="address__input"
                        value={selectedWard}
                        onChange={e => setSelectedWard(e.target.value)}
                        disabled={!selectedProvince}
                    >
                        <option value="" disabled>
                            Chọn Phường/Xã
                        </option>
                        {wards.map(ward => (
                            <option key={ward.code} value={ward.name}>
                                {ward.name}
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        className="address__input"
                        placeholder="Địa chỉ chi tiết"
                        value={detailAddress}
                        onChange={e => setDetailAddress(e.target.value)}
                    />
                    <button type="submit" className="address__button">
                        Thêm địa chỉ
                    </button>
                </form>
            </div>
        </div>
    );
};
