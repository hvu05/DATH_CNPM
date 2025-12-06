import axios from './axios.customize';

export interface BrandResponse {
    id: string;
    name: string;
}

export const getBrands = async (): Promise<BrandResponse[]> => {
    try {
        const res = await axios.get('/brand');

        if (Array.isArray(res.data?.data)) {
            return res.data.data;
        }

        if (Array.isArray(res.data)) {
            return res.data;
        }

        return [];
    } catch (error) {
        console.error("Error fetching brands:", error);
        return [];
    }
};
