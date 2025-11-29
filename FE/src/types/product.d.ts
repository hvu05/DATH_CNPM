// FE/src/types/product.d.ts

// Định nghĩa Interface cho Variant
export interface BackendVariant {
    id: number;
    product_id: number;
    color: string;
    storage: string;
    price: number;
    quantity: number;
    import_price?: number;
}

// Định nghĩa Interface cho Image
export interface BackendImage {
    product_id?: number;
    image_url: string;
    image_public_id?: string;
    is_thumbnail: boolean;
}

// 1. Cấu trúc dữ liệu Review từ Backend
export interface BackendReview {
    id: number;
    comment: string;
    vote: number;
    user_id: string;
    product_id: number;
    create_at?: string;
    user?: {
        full_name: string;
        avatar: string;
    };
    children_reviews?: BackendReview[];
}

export interface ReviewResponse {
    reviews: BackendReview[];
    total: number;
    page: number;
    limit: number;
}

// 2. Cấu trúc dữ liệu Product
export interface BackendProduct {
    id: number;
    name: string;
    description: string;
    quantity: number;
    brand_id?: number;
    category_id?: number;
    is_active?: boolean;
    brand?: { id: number; name: string };
    category?: { id: number; name: string };
    product_image?: BackendImage[];
    product_variants?: BackendVariant[];
    reviews?: any[];
    rate?: { avg: number; count: number };
}

// 3. Cấu trúc dữ liệu UI Product
export interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    imageUrl: string;
    brand?: string;
    category?: string;
    rating?: number;
    originalData?: BackendProduct;
    originalVariants?: BackendVariant[];
    originalImages?: BackendImage[];
}
