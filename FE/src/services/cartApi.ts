import axios from './axios.customize';
import type { CartItem } from '@/contexts/CartContext';

export const getCartApi = async () => {
    try {
        const res: any = await axios.get('/cart');
        const rawData = res.data?.data || res.data || [];

        if (!Array.isArray(rawData)) return [];

        return rawData.map((item: any) => ({
            productId: item.product_variant?.product_id || item.product_id,
            variantId: item.product_variant_id,
            name: item.product_variant?.product?.name || 'Sản phẩm',
            price: Number(item.product_variant?.price || 0),
            imageUrl: item.product_variant?.product?.product_image?.[0]?.image_url || '',
            quantity: item.quantity,
        }));
    } catch (error) {
        console.error('Lỗi lấy giỏ hàng:', error);
        return [];
    }
};

export const addToCartApi = async (variantId: number, quantity: number) => {
    try {
        // Backend thường cần variantId và quantity
        await axios.post('/cart', { product_variant_id: variantId, quantity });
        return true;
    } catch (error) {
        console.error('Lỗi thêm giỏ hàng:', error);
        return false;
    }
};

export const updateCartQuantityApi = async (variantId: number, quantity: number) => {
    try {
        await axios.put('/cart', { product_variant_id: variantId, quantity });
        return true;
    } catch (error) {
        return false;
    }
};

export const removeCartItemApi = async (variantId: number) => {
    try {
        await axios.delete(`/cart/${variantId}`);
        return true;
    } catch (error) {
        return false;
    }
};
