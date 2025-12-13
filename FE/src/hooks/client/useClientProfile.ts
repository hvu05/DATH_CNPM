import { useEffect, useState } from 'react';
import { userAPI } from '@/services/user/profiles/user.profiles.api';

export const useClientProfile = () => {
    const [profile, setProfile] = useState<IUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const res = await userAPI.getProfile();
            if (res.success) setProfile(res.data!);
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (data: Partial<IUser>) => {
        setUpdating(true);
        try {
            const res = await userAPI.updateProfile(data);
            if (res.success) setProfile(res.data!);
            console.log('updateProfile 2', res)
            return res;
        } finally {
            setUpdating(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    return {
        data: profile,
        loading: loading,
        updating: updating,
        updateProfile: updateProfile,
    };
};
