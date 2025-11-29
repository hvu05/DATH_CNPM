// FE/src/services/productsApi.ts
import axios from './axios.customize';
import type { Product, BackendReview } from '../types/product';

const mapToUiProduct = (item: any): Product => {
    let price = 0;

    // LOGIC GIÁ CHUẨN: Lấy giá nhỏ nhất từ bảng productvariant
    if (
        item.product_variants &&
        Array.isArray(item.product_variants) &&
        item.product_variants.length > 0
    ) {
        const prices = item.product_variants.map((v: any) => Number(v.price));
        price = Math.min(...prices);
    }
    // Nếu không có variant, giá = 0 (Liên hệ)

    let imageUrl = 'https://placehold.co/400?text=No+Image';
    if (item.product_image && Array.isArray(item.product_image) && item.product_image.length > 0) {
        const thumb = item.product_image.find((img: any) => img.is_thumbnail);
        imageUrl = thumb ? thumb.image_url : item.product_image[0].image_url;
    }

    return {
        id: item.id,
        name: item.name,
        // Xử lý chữ "desc" thừa trong DB bằng replace
        description: (item.description || '').replace(/^desc\s*/i, ''),
        price: price,
        imageUrl: imageUrl,
        brand: item.brand?.name || 'Unknown',
        category: item.category?.name || 'General',
        rating: item.rate?.avg || 5,

        // Giữ lại data gốc để trang chi tiết dùng
        originalData: item,
        originalVariants: item.product_variants || [], // Cực kỳ quan trọng để chọn màu/giá
        originalImages: item.product_image || [],
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
        const payload = res.data || res;

        let rawList: any[] = [];
        if (payload.data && Array.isArray(payload.data.results)) rawList = payload.data.results;
        else if (Array.isArray(payload.data)) rawList = payload.data;
        else if (Array.isArray(payload.results)) rawList = payload.results;
        else if (Array.isArray(payload)) rawList = payload;

        return rawList.map((item: any) => mapToUiProduct(item));
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
};

export const getProductById = async (id: string | number): Promise<Product | null> => {
    try {
        const res: any = await axios.get(`/products/${id}`);
        const payload = res.data || res;
        const item = payload.data || payload;
        if (!item || !item.id) return null;
        return mapToUiProduct(item);
    } catch {
        return null;
    }
};

// SỬA LẠI ĐƯỜNG DẪN CATEGORY
export const getCategories = async (): Promise<any[]> => {
    try {
        // Thử gọi /category thay vì /categories (Check file category.route.ts của bạn)
        const res: any = await axios.get('/category');
        const payload = res.data || res;
        const data = Array.isArray(payload) ? payload : payload.data || [];
        return data;
    } catch (error) {
        console.error('Lỗi lấy danh mục, kiểm tra lại route BE');
        return [];
    }
};

// ... Các hàm review giữ nguyên
export const getProductReviews = async (id: number | string) => {
    /*...*/ return [];
};
export const createProductReview = async (id: any, data: any) => {
    /*...*/ return true;
};
