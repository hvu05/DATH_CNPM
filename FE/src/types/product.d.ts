// FE/src/types/product.d.ts

// 1. Cấu trúc dữ liệu gốc từ Backend (Prisma)
export interface BackendProduct {
    id: number;
    name: string;
    description: string;
    brand_id?: number;
    category_id?: number;
    brand?: { id: number; name: string };
    category?: { id: number; name: string };
    // Relation
    product_image?: { id: number; image_url: string; is_thumbnail: boolean }[];
    product_variants?: { id: number; price: number; color?: string; storage?: string; quantity: number }[];
    product_specs?: { id: number; spec_name: string; spec_value: string }[];
    reviews?: any[];
}

// 2. Cấu trúc dữ liệu đã được làm phẳng để dùng cho UI (Giống MockData cũ)
export interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;      // Đã tính toán từ variant thấp nhất
    imageUrl: string;   // Đã lấy từ ảnh thumbnail
    brand?: string;
    category?: string;
    originalData?: BackendProduct; // Giữ lại data gốc nếu cần xử lý sâu hơn
}