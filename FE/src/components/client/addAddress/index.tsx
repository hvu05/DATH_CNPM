import { useState, useEffect } from 'react';
import './index.scss';
import type { AddressRequest, Province, Ward } from '@/types/clients/client.address.types';
import { addressAPI } from '@/services/user/address/user.address.api';
import { province_api, ward_api } from './addressFake';
import { message } from 'antd';

//! Chỗ này Fake api của Address

interface AddAddressProps {
  setIsAddresses: React.Dispatch<React.SetStateAction<boolean>>;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

// Interface cho form data
interface AddressFormData {
  receive_name: string;
  phone: string;
  province: string;
  ward: string;
  detail: string;
}

export const AddAddress: React.FC<AddAddressProps> = ({ setIsAddresses, setRefresh }) => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  
  // Gom tất cả state thành 1 object
  const [formData, setFormData] = useState<AddressFormData>({
    receive_name: '',
    phone: '',
    province: '',
    ward: '',
    detail: '',
  });

  // Fetch provinces on component mount
  useEffect(() => {
    const fetchProvinces = async () => {
      // try {
      //   const data = await addressAPI.getProvinces();
      //   setProvinces(data.provinces); // Assume that data has a `provinces` field
      // } catch (error) {
      //   console.error('Failed to fetch provinces', error);
      // }
      setProvinces(province_api);
    };

    fetchProvinces();
  }, []);

  // Fetch wards when a province is selected
  useEffect(() => {
    const fetchWards = async () => {
      // if (!formData.province) return;
      // try {
      //   const data = await addressAPI.getAwards({ codeProvince: formData.province });
      //   setWards(data.communes); // Assume that data has a `communes` field
      // } catch (error) {
      //   console.error('Failed to fetch wards', error);
      // }
      setWards(ward_api);
    };

    fetchWards();
  }, [formData.province]);

  // Hàm xử lý thay đổi cho tất cả input/select/textarea
  const handleChangeForm = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Validation
    if (!formData.receive_name.trim()) {
      message.error('Vui lòng nhập tên người nhận');
      return;
    }
    if (!formData.phone.trim()) {
      message.error('Vui lòng nhập số điện thoại');
      return;
    }
    if (!formData.province) {
      message.error('Vui lòng chọn Tỉnh/Thành phố');
      return;
    }
    if (!formData.ward) {
      message.error('Vui lòng chọn Phường/Xã');
      return;
    }
    if (!formData.detail.trim()) {
      message.error('Vui lòng nhập địa chỉ chi tiết');
      return;
    }

    console.log('add address', formData);

    const objRequest: AddressRequest = {
      receive_name: formData.receive_name,
      phone: formData.phone,
      province: formData.province,
      ward: formData.ward,
      detail: formData.detail,
    };

    try {
      const res = await addressAPI.createANewAddress(objRequest);
      if (res) {
        message.success('Thêm địa chỉ thành công');
        setRefresh(refresh => !refresh);
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
        <h2 className="address__title">Thêm địa chỉ mới</h2>
        <div className="address__close" onClick={() => setIsAddresses(false)}>
          x
        </div>
        
        <form className="address__form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="receive_name"
            className="address__input"
            placeholder="Nhập tên người nhận"
            value={formData.receive_name}
            onChange={handleChangeForm}
          />

          <input
            type="tel"
            name="phone"
            className="address__input"
            placeholder="Nhập số điện thoại"
            value={formData.phone}
            onChange={handleChangeForm}
          />

          <select
            name="province"
            className="address__input"
            value={formData.province}
            onChange={handleChangeForm}
          >
            <option value="">Chọn Tỉnh/Thành phố</option>
            {provinces.map(province => (
              <option key={province.code} value={province.name}>
                {province.name}
              </option>
            ))}
          </select>

          <select
            name="ward"
            className="address__input"
            value={formData.ward}
            onChange={handleChangeForm}
            disabled={!formData.province}
          >
            <option value="">Chọn Phường/Xã</option>
            {wards.map(ward => (
              <option key={ward.code} value={ward.name}>
                {ward.name}
              </option>
            ))}
          </select>

          <textarea
            name="detail"
            className="address__input"
            placeholder="Nhập địa chỉ chi tiết (Số nhà, tên đường...)"
            value={formData.detail}
            onChange={handleChangeForm}
            rows={3}
          />

          <button type="submit" className="address__button">
            Thêm địa chỉ
          </button>
        </form>
      </div>
    </div>
  );
};