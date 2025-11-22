import type { Address } from './client.address.types';

// Định nghĩa các trường của OrderItem
export interface ItemOrderRequest {
    product_id: number;
    product_variant_id: number;
    quantity: number;
}

// Định nghĩa kiểu dữ liệu cho đơn hàng
type PaymentMethod = 'COD' | 'VNPAY';
export interface OrderRequest {
    province: string;
    ward: string;
    detail: string;
    items: ItemOrderRequest[];
    note?: string;
    method: PaymentMethod;
}
// Định nghĩa kiểu dữ liệu cho ProductVariant (Biến thể của sản phẩm)
export interface ProductVariant {
    id: number;
    product_id: number;
    color: string;
    storage: string;
    name: string;
    price: number;
}

// Định nghĩa kiểu dữ liệu cho OrderItem (Mỗi sản phẩm trong đơn hàng)
export interface OrderItem {
    id: number;
    price_per_item: number;
    quantity: number;
    product_variant: ProductVariant;
}

export interface OrderResponse {
    id: string;
    user_id: string;
    total: number;
    status: string;
    address: Address;
    create_at: Date;
    order_items: OrderItem[];
    url?: string;
}

// export interface OrderAllResponse {
//     success: boolean,
//     data: 
// }
