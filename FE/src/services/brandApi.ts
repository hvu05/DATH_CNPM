import axios from './axios.customize';

export interface BrandResponse {
    id: string;
    name: string;
}

export const getBrands = async (categoryId?: string | number): Promise<BrandResponse[]> => {
    try {
        const params = categoryId ? { category_id: categoryId } : {};
        
        const res = await axios.get('/brand', { params });

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