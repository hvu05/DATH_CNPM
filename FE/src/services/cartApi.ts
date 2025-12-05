import axios from './axios.customize';
import type { CartItem } from '@/contexts/CartContext';

export const getCartApi = async () => {
    try {
        const res: any = await axios.get('/carts');
        const rawData = res.data?.data || res.data || [];

        if (!Array.isArray(rawData)) return [];

        return rawData.map((item: any) => ({
            productId: item.product_variant?.product_id || item.product_id,
            variantId: item.product_variant_id,
            name: item.product_variant?.name || 'Sản phẩm', 
            price: Number(item.product_variant?.price || 0),
            imageUrl: item.thumbnail || '', 
            quantity: item.quantity,
            maxStock: item.product_variant?.quantity || 999 
        }));
    } catch (error) {
        console.error('Lỗi lấy cart:', error);
        return [];
    }
};

export const addToCartApi = async (productId: number, variantId: number, quantity: number) => {
    try {
        await axios.post('/carts', {
            product_id: productId,
            product_variant_id: variantId,
            quantity
        });
        return true;
    } catch (error) {
        console.error('Lỗi thêm giỏ hàng:', error);
        return false;
    }
};

export const updateCartQuantityApi = async (productId: number, variantId: number, quantity: number) => {
    try {
        await axios.put('/carts', {
            product_id: productId,
            product_variant_id: variantId,
            quantity
        });
        return true;
    } catch (error) {
        return false;
    }
};

export const removeCartItemApi = async (variantId: number) => {
    try {
        await axios.delete(`/carts/${variantId}`);
        return true;
    } catch (error) {
        return false;
    }
};