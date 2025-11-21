//! Filepath: @/services/user/address/user.address.api.ts
import type { AddressRequest, AddressResponse, ProvincesResponse, WardRequest, WardsResponse } from '@/types/clients/client.address.types';
import axios from '@/services/axios.customize';

export const addressAPI = {
    getProvinces: async(): Promise<ProvincesResponse> => {
        const res = await fetch('https://production.cas.so/address-kit/2025-07-01/provinces',
            {method: 'GET'}
        )
        if (!res.ok) {
            throw new Error('Failed to fetch provinces');
        }

        const data: ProvincesResponse = await res.json(); // Parse the JSON response and cast it
        return data; // Return the typed data
    },
    getAwards: async(params: WardRequest): Promise<WardsResponse> => {
        const res = await fetch(`https://production.cas.so/address-kit/2025-07-01/provinces/${params.codeProvince}/communes`,
            {method: 'GET'}
        )
        if (!res.ok) {
            throw new Error('Failed to fetch wards');
        }
        const data: WardsResponse = await res.json();
        return data;
    },
    createANewAddress: async(params: AddressRequest)  => {
        const res = await axios.post<AddressResponse>(`/users/address`,  params )

        return res.data
    }
}