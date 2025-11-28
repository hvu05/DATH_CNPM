// FE/src/services/productsAPI.ts
import axios from './axios.customize';
import type { Product, BackendProduct, BackendReview } from '../types/product';

const mapToUiProduct = (item: BackendProduct): Product => {
    let price = 0;
    if (item.product_variants && item.product_variants.length > 0) {
        price = Math.min(...item.product_variants.map(v => Number(v.price)));
    }

    let imageUrl = 'https://placehold.co/400?text=No+Image';
    if (item.product_image && item.product_image.length > 0) {
        const thumb = item.product_image.find(img => img.is_thumbnail);
        imageUrl = thumb ? thumb.image_url : item.product_image[0].image_url;
    }

    return {
        id: item.id,
        name: item.name,
        description: item.description,
        price: price,
        imageUrl: imageUrl,
        brand: item.brand?.name || '',
        category: item.category?.name || '',
        rating: item.rate?.avg || 0,
        
        originalData: item,
        originalVariants: item.product_variants || [],
        originalImages: item.product_image || []
    };
};

export const getProducts = async (params?: any): Promise<Product[]> => {
    try {
        const apiParams = { ...params };
        if (apiParams.q) {
            apiParams.search = apiParams.q;
            delete apiParams.q;
        }

        const res: any = await axios.get('/products', { params: apiParams });
        
        const payload = res?.data ?? res;
        const rawData = Array.isArray(payload) ? payload : (payload?.results ?? payload?.data ?? []);
        
        if (!Array.isArray(rawData)) return [];
        return rawData.map((item: BackendProduct) => mapToUiProduct(item));
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
};

export const getProductById = async (id: string | number): Promise<Product | null> => {
    try {
        const res: any = await axios.get(`/products/${id}`);
        const payload = res?.data ?? res;
        if (!payload) return null;
        return mapToUiProduct(payload as BackendProduct);
    } catch (error) {
        console.error("Error fetching product by id:", error);
        return null;
    }
};

export const getProductReviews = async (productId: number | string): Promise<BackendReview[]> => {
    try {
        const res: any = await axios.get(`/products/${productId}/reviews`);
        const payload = res?.data ?? res;
        
        if (payload?.reviews && Array.isArray(payload.reviews)) {
            return payload.reviews;
        }
        return [];
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return [];
    }
};

export const createProductReview = async (
    productId: number | string, 
    data: { comment: string; vote: number }
): Promise<boolean> => {
    try {
        await axios.post(`/products/${productId}/reviews`, data);
        return true;
    } catch (error) {
        console.error("Error creating review:", error);
        return false;
    }
};