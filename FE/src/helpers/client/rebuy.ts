import type { CartItem } from '@/contexts/CartContext';
import type { OrdersInOrder } from '@/types/clients/client.order.types';
import type { NavigateFunction } from 'react-router-dom';

export const handleRebuy = (order: OrdersInOrder, navigate: NavigateFunction) => {
    const CartOrder = mapToCartItem(order)
    const total: number = calculateTotal(CartOrder)

    // console.log('cartorder', CartOrder)
    navigate(`/client/order`, { state: { orderItems: CartOrder, total: total} });
};
const calculateTotal = (CartOrder: CartItem[]): number => {
    let total: number = 0;
    CartOrder.forEach(item => {
        total += item.price * item.quantity
    })
    return total
}
export const mapToCartItem = (order: OrdersInOrder): CartItem[] => {
    let cartItem: CartItem[] = [];
    order.order_items.forEach(item => {
        cartItem.push({
            productId: item.product_variant.product_id,
            variantId: item.product_variant.id,
            name: item.product_variant.name,
            price: item.product_variant.price,
            imageUrl: item.product_variant.thumbnail,
            quantity: item.quantity,
        });
    });
    return cartItem
}
