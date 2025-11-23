import { useEffect, useState } from 'react';
import { addressAPI } from '@/services/user/address/user.address.api';
import type { Address } from '@/types/clients/client.address.types';

export const useGetClientAddress = (refresh: boolean) => {
    const [address, setAddress] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await addressAPI.getAddress();
                if (res) {
                    setLoading(false);
                    setAddress(res.data.addresses);
                }
            } catch (err) {
                setLoading(false);
            }
        };
        fetchData();
    }, [refresh]);

    return {
        data: address,
        loading: loading,
    };
};
