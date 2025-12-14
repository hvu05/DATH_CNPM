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
    thumbnail: string
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

//=====================================================================
export type PaymentInOrder = {
    id: string;
    order_id: string;
    amount: number;
    method: 'COD' | 'VNPAY'; // Bạn có thể thêm các phương thức thanh toán khác vào đây nếu cần
    payment_status: string; // Cập nhật các trạng thái thanh toán tùy thuộc vào yêu cầu
    transaction_code: string | null;
    create_at: string; // hoặc có thể là Date tùy vào việc bạn muốn xử lý
    update_at: string; // hoặc có thể là Date
    user_id: string;
};

type UserInOrder = {
    id: string;
    full_name: string;
    email: string;
    password: string;
    phone: string;
    role_id: number;
    is_active: boolean;
    avatar: string | null; // Avatar có thể là URL ảnh hoặc null nếu không có avatar
    create_at: Date; // Hoặc có thể là Date nếu bạn muốn làm việc với ngày tháng
    update_at: Date; // Hoặc có thể là Date
};
export type OrderItemInOrder = {
    id: string;
    price_per_item: number;
    quantity: number;
    product_variant: ProductVariant;
};
export type StatusOrder =
    | 'RETURNED' // đã trả hàng
    | 'RETURN_REQUEST' // users yêu cầu trả hàng, nhân viên chưa xác nhận
    | 'PENDING' // đang chờ thanh toán
    | 'PROCESSING' // đang xử lý (chờ nhân viên chuyển qua trạng thái DELIVERING)
    | 'DELIVERING' // đang giao (chờ nhân viên chuyển qua trạng thái COMPLETED)
    | 'COMPLETED' // đã giao hàng thành công
    | 'CANCELLED' // đơn hàng đã hủy thành công
    | 'REFUNDED';

export type OrdersInOrder = {
    id: string;
    user_id: string;
    total: number;
    status: StatusOrder;
    address: Address;
    create_at: Date;
    payment: PaymentInOrder;
    order_items: OrderItemInOrder[];
};
export type DataInOrder = {
    count: number;
    user: UserInOrder;
    orders: OrdersInOrder[];
};
export interface OrderAllResponse {
    success: boolean;
    data: DataInOrder;
}
// ==================return order =========================
export interface RequestReturnOrder {
    reason: string,
}
export interface ResponseReturnOrder {
    order: {
      id: string,
      user_id: string,
      total: number,
      status: string,
      address: Partial<Address>,
      deliver_at: string,
    },
    //! Chưa hoàn thành cái này
}

//=======================PAYMENT========================
type payment_method = 'VNPAY' | 'MOMO';
export interface PaymentRequest {
    order_id: string;
    payment_method: payment_method;
}
export interface PaymentResponse {
    payment: PaymentInOrder;
    url: string;
}
