// FE/src/services/productsApi.ts
import axios from './axios.customize';
import type { Product, BackendVariant, BackendImage } from '@/types/product';

const transformProduct = (item: any): Product => {
    // 1. Lấy giá: JSON trả về "default_price"
    const price = Number(item.default_price ?? item.price ?? 0);

    // 2. Lấy ảnh: JSON trả về mảng "product_image"
    let imageUrl = 'https://placehold.co/400?text=No+Image';
    if (item.product_image && Array.isArray(item.product_image) && item.product_image.length > 0) {
        // Ưu tiên ảnh có is_thumbnail = true
        const thumb = item.product_image.find((img: any) => img.is_thumbnail);
        imageUrl = thumb ? thumb.image_url : item.product_image[0].image_url;
    } else if (item.image_url) {
        imageUrl = item.image_url;
    }

    // 3. Xử lý Brand/Category: JSON trả về object bên trong
    const brand = item.brand?.name || 'Khác';
    const category = item.category?.name || 'Khác';

    // 4. Xử lý Rating: JSON trả về object "rate": { "avg": 0, "count": 0 }
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

        // Map nguyên gốc để dùng ở trang Detail nếu cần
        originalVariants: item.product_variants || [],
        originalImages: item.product_image || [],
    };
};

export const getProducts = async (params?: any): Promise<Product[]> => {
    try {
        const res: any = await axios.get('/products', { params });

        // 1. Lấy payload thực sự
        const payload = res.data || res;

        // 2. Trích xuất mảng results từ cấu trúc data.results
        let rawData: any[] = [];

        if (payload.data && Array.isArray(payload.data.results)) {
            rawData = payload.data.results;
        } else if (Array.isArray(payload.data)) {
            rawData = payload.data;
        } else if (Array.isArray(payload)) {
            rawData = payload;
        }

        if (rawData.length === 0) {
            // console.warn('Không tìm thấy dữ liệu sản phẩm. Payload:', payload);
        }

        // 3. Map dữ liệu
        let products = rawData.map((item: any) => transformProduct(item));

        // 4. Filter Client-side nếu cần
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
