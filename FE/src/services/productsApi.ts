// FE/src/services/productsApi.ts
import axios from './axios.customize';
import type { Product, BackendReview } from '../types/product';

const BRAND_MAP: Record<number, string> = {
    1: 'Macbook', 2: 'Asus', 3: 'Dell', 4: 'iPhone', 5: 'Samsung', 7: 'iPad'
};
const CATEGORY_MAP: Record<number, string> = {
    1: 'Laptop', 2: 'Điện thoại', 3: 'Máy tính bảng', 16: 'Đồng hồ'
};

const mapToUiProduct = (item: any): Product => {
    let price = 0;
    // Ưu tiên 1: Giá mặc định
    if (item.default_price && Number(item.default_price) > 0) {
        price = Number(item.default_price);
    }
    // Ưu tiên 2: Giá từ Variants
    else if (item.product_variants && item.product_variants.length > 0) {
        const prices = item.product_variants.map((v: any) => Number(v.price));
        price = Math.min(...prices);
    }
    // Ưu tiên 3: Giá cũ
    else {
        price = Number(item.price) || 0;
    }

    // Fallback: Random giá (Chỉ để test giao diện, nên xóa khi DB chuẩn)
    if (price === 0) price = 15000000 + (item.id * 500000);

    const brandName = item.brand?.name || BRAND_MAP[item.brand_id] || 'Khác';
    const categoryName = item.category?.name || CATEGORY_MAP[item.category_id] || 'Khác';

    let imageUrl = 'https://placehold.co/400?text=No+Image';
    if (item.product_image && item.product_image.length > 0) {
        const thumb = item.product_image.find((img: any) => img.is_thumbnail);
        imageUrl = thumb ? thumb.image_url : item.product_image[0].image_url;
    }

    return {
        id: item.id,
        name: item.name,
        description: (item.description || '').replace(/^desc\s*/i, ''),
        price: price,
        imageUrl: imageUrl,
        brand: brandName,
        category: categoryName,
        rating: 0, // Để 0 để FE tự tính toán lại từ reviews
        originalData: item,
        originalVariants: item.product_variants || [],
        originalImages: item.product_image || []
    };
};

export const getProducts = async (params?: any): Promise<Product[]> => {
    try {
        const res: any = await axios.get('/products');
        const payload = res.data || res;
        
        let rawList: any[] = [];
        if (payload.data && Array.isArray(payload.data.results)) rawList = payload.data.results;
        else if (Array.isArray(payload.data)) rawList = payload.data;
        else if (Array.isArray(payload.results)) rawList = payload.results;
        else if (Array.isArray(payload)) rawList = payload;

        const allProducts = rawList.map((item: any) => mapToUiProduct(item));

        if (params?.q) {
            const q = params.q.toLowerCase();
            return allProducts.filter(p => 
                p.name.toLowerCase().includes(q) || 
                (p.brand && p.brand.toLowerCase().includes(q))
            );
        }
        return allProducts;
    } catch (error) {
        return [];
    }
};

export const getProductById = async (id: string | number): Promise<Product | null> => {
    try {
        const res: any = await axios.get(`/products/${id}`);
        const item = res.data?.data || res.data || res;
        if (!item || !item.id) return null;
        return mapToUiProduct(item);
    } catch { return null; }
};

export const getCategories = async (): Promise<any[]> => {
    // Trả về luôn mảng cứng để Header hiển thị ngay lập tức
    return [
        { id: 'phones', name: 'Điện thoại' },
        { id: 'laptops', name: 'Máy tính' },
        { id: 'tablets', name: 'Máy tính bảng' },
        { id: 'watches', name: 'Đồng hồ' }
    ];
};

// Fake Reviews (Đã fix lỗi TS)
const FAKE_COMMENTS = ["Tuyệt vời!", "Giá tốt.", "Dùng ổn.", "Giao nhanh."];
const FAKE_USERS = ["User A", "User B", "User C"];

export const getProductReviews = async (productId: number | string): Promise<BackendReview[]> => {
    return Array.from({ length: 3 }).map((_, i) => ({
        id: i,
        user_id: `user-${i}`,        // Thêm field thiếu
        product_id: Number(productId), // Thêm field thiếu
        comment: FAKE_COMMENTS[i % FAKE_COMMENTS.length],
        vote: 5,
        create_at: new Date().toISOString(),
        user: { full_name: FAKE_USERS[i % FAKE_USERS.length], avatar: '' }
    }));
};

// Fix lỗi biến không dùng
export const createProductReview = async (_id: any, _data: any) => { return true; };