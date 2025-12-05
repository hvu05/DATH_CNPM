// FE/src/contexts/CartContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthContext } from './AuthContext';
import {
    getCartApi,
    addToCartApi,
    updateCartQuantityApi,
    removeCartItemApi,
} from '@/services/cartApi.ts';
import { message } from 'antd';

export interface CartItem {
    productId: number;
    variantId: number;
    name: string;
    price: number;
    imageUrl: string;
    quantity: number;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: CartItem) => Promise<void>;
    removeFromCart: (productId: number, variantId: number) => void;
    updateQuantity: (productId: number, variantId: number, quantity: number) => void;
    removeManyFromCart: (items: CartItem[]) => void;
    clearCart: () => void;
    changeCartItemVariant: (
        oldItem: CartItem,
        newVariant: { id: number; name: string; price: number; quantity?: number }
    ) => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const { isLoggedIn } = useAuthContext();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    useEffect(() => {
        const syncCart = async () => {
            if (isLoggedIn) {
                const guest = localStorage.getItem('CART_GUEST');
                let shouldFetch = true;

                if (guest) {
                    const guestItems = JSON.parse(guest);

                    for (const item of guestItems) {
                        await addToCartApi(item.productId, item.variantId, item.quantity);
                    }

                    localStorage.removeItem('CART_GUEST');
                    shouldFetch = true;
                }

                if (shouldFetch) {
                    const items = await getCartApi();
                    setCartItems(items);
                }
            } else {
                const stored = localStorage.getItem('CART_GUEST');
                setCartItems(stored ? JSON.parse(stored) : []);
            }
        };

        syncCart();
    }, [isLoggedIn]);

    const addToCart = async (newItem: CartItem) => {
        const existingIndex = cartItems.findIndex(
            i => i.productId === newItem.productId && i.variantId === newItem.variantId
        );
        let updatedCart = [...cartItems];

        if (existingIndex > -1) {
            updatedCart[existingIndex].quantity += newItem.quantity;
        } else {
            updatedCart.push(newItem);
        }

        setCartItems(updatedCart);
        if (isLoggedIn) {
            try {
                const success = await addToCartApi(
                    newItem.productId,
                    newItem.variantId,
                    newItem.quantity
                );

                if (success) {
                    const items = await getCartApi();
                    setCartItems(items);
                } else {
                    message.error('Thêm vào giỏ hàng thất bại. Vui lòng thử lại.');
                    const remote = await getCartApi();
                    setCartItems(remote);
                }
            } catch (error) {
                console.error('Lỗi thêm giỏ hàng backend:', error);
                message.error('Thêm vào giỏ hàng thất bại. Vui lòng thử lại.');
            }
        } else {
            const existingIndex = cartItems.findIndex(
                item => item.variantId === newItem.variantId && item.productId === newItem.productId
            );

            let updatedCart = [...cartItems];

            if (existingIndex > -1) {
                updatedCart[existingIndex].quantity += newItem.quantity;
            } else {
                updatedCart = [...updatedCart, newItem];
            }

            setCartItems(updatedCart);
            localStorage.setItem('CART_GUEST', JSON.stringify(updatedCart));
        }
    };

    const updateQuantity = async (productId: number, variantId: number, qty: number) => {
        if (qty <= 0) return removeFromCart(productId, variantId);

        if (isLoggedIn) {
            const success = await updateCartQuantityApi(productId, variantId, qty);
            if (success) {
                const items = await getCartApi();
                setCartItems(items);
            } else {
                message.error('Cập nhật số lượng giỏ hàng thất bại');
            }
        } else {
            const updated = cartItems.map(i =>
                i.variantId === variantId && i.productId === productId ? { ...i, quantity: qty } : i
            );
            setCartItems(updated);
            localStorage.setItem('CART_GUEST', JSON.stringify(updated));
        }
    };

    const removeFromCart = async (productId: number, variantId: number) => {
        if (isLoggedIn) {
            try {
                const success = await removeCartItemApi(variantId);

                if (success) {
                    message.success('Đã xóa sản phẩm khỏi giỏ hàng.');
                    const remote = await getCartApi();
                    setCartItems(remote);
                } else {
                    message.error('Xóa sản phẩm khỏi giỏ hàng thất bại.');
                }
            } catch (error) {
                console.error(error);
                message.error('Đã xảy ra lỗi khi xóa sản phẩm khỏi giỏ hàng.');
            }
        } else {
            const updated = cartItems.filter(
                i => !(i.variantId === variantId && i.productId === productId)
            );
            setCartItems(updated);
            localStorage.setItem('CART_GUEST', JSON.stringify(updated));
        }
    };
    const changeCartItemVariant = async (
        oldItem: CartItem,
        newVariant: { id: number; name: string; price: number; quantity?: number }
    ) => {
        const currentCart = [...cartItems];

        const oldIndex = currentCart.findIndex(
            i => i.productId === oldItem.productId && i.variantId === oldItem.variantId
        );
        if (oldIndex === -1) return;

        const existIndex = currentCart.findIndex(
            i => i.productId === oldItem.productId && i.variantId === newVariant.id
        );

        const newMaxStock = newVariant.quantity ?? 999;

        let finalQuantity = oldItem.quantity;
        if (finalQuantity > newMaxStock) {
            finalQuantity = newMaxStock;
            message.warning(
                `Số lượng đã được giảm xuống mức tối đa (${newMaxStock}) do tồn kho hạn chế.`
            );
        }

        let updatedCart: CartItem[] = [];

        if (existIndex > -1 && existIndex !== oldIndex) {
            const combinedQty = currentCart[existIndex].quantity + finalQuantity;
            currentCart[existIndex].quantity = Math.min(combinedQty, newMaxStock);
            currentCart.splice(oldIndex, 1);
            updatedCart = currentCart;
        } else {
            currentCart[oldIndex] = {
                ...currentCart[oldIndex],
                variantId: newVariant.id,
                name: newVariant.name,
                price: newVariant.price,
                quantity: finalQuantity,
            };
            updatedCart = currentCart;
        }

        setCartItems(updatedCart);
        if (!isLoggedIn) {
            localStorage.setItem('CART_GUEST', JSON.stringify(updatedCart));
        }

        if (isLoggedIn) {
            try {
                await removeCartItemApi(oldItem.variantId);

                if (finalQuantity > 0) {
                    await addToCartApi(oldItem.productId, newVariant.id, finalQuantity);
                }

                const remote = await getCartApi();
                setCartItems(remote);
            } catch (error) {
                console.error('Lỗi cập nhật backend', error);
                message.error('Cập nhật giỏ hàng thất bại. Vui lòng thử lại.');
                if (isLoggedIn) {
                    const remote = await getCartApi();
                    setCartItems(remote);
                } else {
                    const stored = localStorage.getItem('CART_GUEST');
                    setCartItems(stored ? JSON.parse(stored) : []);
                }
            }
        }
    };
    const removeManyFromCart = async (items: CartItem[]) => {
        if (isLoggedIn) {
            for (const item of items) {
                await removeCartItemApi(item.variantId);
            }
            const remote = await getCartApi();
            setCartItems(remote);
        } else {
            const ids = new Set(items.map(i => `${i.productId}-${i.variantId}`));
            const updated = cartItems.filter(i => !ids.has(`${i.productId}-${i.variantId}`));
            setCartItems(updated);
            localStorage.setItem('CART_GUEST', JSON.stringify(updated));
        }
    };

    const clearCart = () => setCartItems([]);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                removeManyFromCart,
                clearCart,
                changeCartItemVariant,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext)!;
