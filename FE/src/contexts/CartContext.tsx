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

    const clearCart = () => setCartItems([]);

    return (
        <CartContext.Provider
            value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext)!;
