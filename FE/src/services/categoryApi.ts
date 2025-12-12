import axios from './axios.customize';

export interface CategoryResponse {
    id: string;
    name: string;
}

export const getCategories = async (): Promise<CategoryResponse[]> => {
    try {
        const res = await axios.get('/category');

        if (Array.isArray(res.data?.data?.results)) {
            return res.data.data.results;
        }

        return [];
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
};
