// FE/src/services/productsApi.ts
import axios from './axios.customize';
import type { Product, BackendVariant, BackendImage } from '@/types/product';

const transformProduct = (item: any): Product => {
    const price = Number(item.default_price ?? item.price ?? 0);

    let imageUrl = 'https://placehold.co/400?text=No+Image';
    if (item.product_image && Array.isArray(item.product_image) && item.product_image.length > 0) {
        const thumb = item.product_image.find((img: any) => img.is_thumbnail);
        imageUrl = thumb ? thumb.image_url : item.product_image[0].image_url;
    } else if (item.image_url) {
        imageUrl = item.image_url;
    }

    const brand = item.brand?.name || 'Khác';
    const category = item.category?.name || 'Khác';

    const rating = item.rate?.avg ? Number(item.rate.avg) : 5;

    return {
        id: item.id,
        name: item.name,
        price: price,
        imageUrl: imageUrl,
        description: item.description || '',
        brand: brand,
        category: category,
        rating: rating,
        quantity: Number(item.quantity || 0),

        originalVariants: item.product_variants || [],
        originalImages: item.product_image || [],
    };
};

export const getProducts = async (params?: any): Promise<Product[]> => {
    try {
        const res = await axios.get('/products', {
            params: { limit: 1000, page: 1, ...params }
        });

        const payload = res.data || res;

        let rawData: any[] = [];

        if (payload.data && Array.isArray(payload.data.results)) {
            rawData = payload.data.results;
        } else if (Array.isArray(payload.data)) {
            rawData = payload.data;
        } else if (Array.isArray(payload)) {
            rawData = payload;
        }

        if (rawData.length === 0) {
        }

        let products = rawData.map((item: any) => transformProduct(item));

        if (params?.q) {
            const q = params.q.toLowerCase();
            products = products.filter(
                p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
            );
        }

        return products;
    } catch (error) {
        console.error('Lỗi API getProducts:', error);
        return [];
    }
};

export const getProductById = async (id: string | number): Promise<Product | null> => {
    try {
        const res: any = await axios.get(`/products/${id}`);
        const payload = res.data || res;

        const item = payload.data || payload;

        if (!item || !item.id) return null;
        return transformProduct(item);
    } catch (error) {
        console.error(`Lỗi API getProductById ${id}:`, error);
        return null;
    }
};
