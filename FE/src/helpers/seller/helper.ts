import { type OrderStatus } from '@/services/seller/seller.service';

export const getStatusColor = (status: OrderStatus) => {
    const colors: Record<OrderStatus, string> = {
        PENDING: 'orange',
        PROCESSING: 'cyan',
        DELIVERING: 'purple',
        COMPLETED: 'green',
        CANCELLED: 'red',
        REFUNDED: 'blue',
        RETURNED: 'wheat',
        RETURN_REQUEST: 'red',
    };
    return colors[status] || 'default';
};

export const getStatusText = (status: OrderStatus) => {
    const texts: Record<OrderStatus, string> = {
        PENDING: 'Chờ xác nhận',
        PROCESSING: 'Đang xử lý',
        DELIVERING: 'Đang giao',
        COMPLETED: 'Hoàn thành',
        CANCELLED: 'Đã hủy',
        RETURN_REQUEST: 'Yêu cầu trả hàng',
        REFUNDED: 'Đã hoàn tiền',
        RETURNED: 'Đã trả hàng',
    };
    return texts[status] || status;
};

export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
};

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
