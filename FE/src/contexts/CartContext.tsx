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
    clearCart: () => void;
    changeCartItemVariant: (
        oldItem: CartItem,
        newVariant: { id: number; name: string; price: number }
    ) => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const { isLoggedIn } = useAuthContext();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    useEffect(() => {
        const fetchCart = async () => {
            if (isLoggedIn) {
                const items = await getCartApi();
                setCartItems(items);
            } else {
                try {
                    const stored = localStorage.getItem('CART_GUEST');
                    setCartItems(stored ? JSON.parse(stored) : []);
                } catch {
                    setCartItems([]);
                }
            }
        };
        fetchCart();
    }, [isLoggedIn]);

    const addToCart = async (newItem: CartItem) => {
        // Tìm kiếm dựa trên CẢ productId và variantId
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

        if (isLoggedIn) {
            await addToCartApi(newItem.variantId, newItem.quantity);
        } else {
            localStorage.setItem('CART_GUEST', JSON.stringify(updatedCart));
        }
    };

    const updateQuantity = async (productId: number, variantId: number, qty: number) => {
        if (qty <= 0) return removeFromCart(productId, variantId);

        if (isLoggedIn) {
            await updateCartQuantityApi(variantId, qty);
            const items = await getCartApi();
            setCartItems(items);
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
            await removeCartItemApi(variantId);
            setCartItems(prev =>
                prev.filter(i => !(i.variantId === variantId && i.productId === productId))
            );
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
        newVariant: { id: number; name: string; price: number }
    ) => {
        // 1. Tạo bản sao giỏ hàng hiện tại để xử lý đồng bộ
        const currentCart = [...cartItems];

        // 2. Tìm vị trí item cũ
        const oldIndex = currentCart.findIndex(
            i => i.productId === oldItem.productId && i.variantId === oldItem.variantId
        );

        if (oldIndex === -1) return;

        // 3. Kiểm tra xem Variant mới đã có trong giỏ chưa?
        const existIndex = currentCart.findIndex(
            i => i.productId === oldItem.productId && i.variantId === newVariant.id
        );

        let updatedCart = [];

        if (existIndex > -1 && existIndex !== oldIndex) {
            currentCart[existIndex].quantity += oldItem.quantity;
            currentCart.splice(oldIndex, 1);
            updatedCart = currentCart;
        } else {
            currentCart[oldIndex] = {
                ...currentCart[oldIndex],
                variantId: newVariant.id,
                name: newVariant.name,
                price: newVariant.price,
            };
            updatedCart = currentCart;
        }

        // 4. Cập nhật State FE ngay lập tức (cho mượt)
        setCartItems(updatedCart);
        if (!isLoggedIn) {
            localStorage.setItem('CART_GUEST', JSON.stringify(updatedCart));
        }

        // 5. Gọi API Backend (Xóa cũ + Thêm mới)
        if (isLoggedIn) {
            try {
                await removeCartItemApi(oldItem.variantId);
                await addToCartApi(newVariant.id, oldItem.quantity);
            } catch (error) {
                console.error('Lỗi cập nhật backend', error);
            }
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
                clearCart,
                changeCartItemVariant,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext)!;
