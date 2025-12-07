// FE/src/services/brandApi.ts
import axios from './axios.customize';

export interface Series {
    id: string | number;
    name: string;
}

export interface BrandResponse {
    id: string | number;
    name: string;
    series?: Series[]; 
}

export const getBrands = async (categoryId?: string | number): Promise<BrandResponse[]> => {
    try {
        const params = categoryId ? { category_id: categoryId } : {};
        const res = await axios.get('/brand', { params });

        if (Array.isArray(res.data?.data)) {
            return res.data.data;
        }
        if (Array.isArray(res.data?.data?.results)) { 
            return res.data.data.results; 
        }

        return [];
    } catch (error) {
        console.error("Error fetching brands:", error);
        return [];
    }
};