import axios from './axios.customize';
import type { Product, BackendProduct } from '../types/product';

// Hàm chuyển đổi từ Backend Product -> UI Product
const mapToUiProduct = (item: BackendProduct): Product => {
    // 1. Tính giá: Lấy giá nhỏ nhất trong các biến thể, nếu không có thì bằng 0
    let price = 0;
    if (item.product_variants && item.product_variants.length > 0) {
        price = Math.min(...item.product_variants.map(v => v.price));
    }

    // 2. Lấy ảnh: Lấy ảnh thumbnail, nếu không có lấy ảnh đầu tiên
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
        originalData: item // Lưu data gốc để dùng ở trang chi tiết
    };
};

export const getProducts = async (params?: any): Promise<Product[]> => {
    try {
        const res = await axios.get('/products', { params });
        // ensure we read the actual payload from axios response
        const payload = res?.data ?? res;
        const rawData = Array.isArray(payload) ? payload : (payload?.data ?? []);
        return rawData.map((item: BackendProduct) => mapToUiProduct(item));
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
};

export const getProductById = async (id: string | number): Promise<Product | null> => {
    try {
        const res = await axios.get(`/products/${id}`);
        const payload = res?.data ?? res;
        const raw = payload?.data ?? payload;
        if (!raw) return null;
        // raw is the backend product object — cast to BackendProduct for typing
        return mapToUiProduct(raw as BackendProduct);
    } catch (error) {
        console.error("Error fetching product by id:", error);
        return null;
    }
};