// FE/src/contexts/CartContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthContext } from './AuthContext';
import {
    getCartApi,
    addToCartApi,
    updateCartQuantityApi,
    removeCartItemApi,
} from '@/services/cartApi';
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
    addToCart: (item: CartItem) => void;
    removeFromCart: (variantId: number) => void;
    updateQuantity: (variantId: number, quantity: number) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const { user, isLoggedIn } = useAuthContext();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    // 1. Fetch Cart: Nếu login gọi API, không thì load LocalStorage
    useEffect(() => {
        const fetchCart = async () => {
            if (isLoggedIn) {
                // USER: Gọi API
                const items = await getCartApi();
                setCartItems(items);
            } else {
                // GUEST: Load LocalStorage
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

    // 2. Add to Cart
    const addToCart = async (newItem: CartItem) => {
        // Optimistic UI Update (Cập nhật giao diện trước cho mượt)
        const prevCart = [...cartItems];
        setCartItems(prev => {
            const idx = prev.findIndex(i => i.variantId === newItem.variantId);
            if (idx > -1) {
                const clone = [...prev];
                clone[idx].quantity += newItem.quantity;
                return clone;
            }
            return [...prev, newItem];
        });

        if (isLoggedIn) {
            // Gọi API Backend
            const success = await addToCartApi(newItem.variantId, newItem.quantity);
            if (!success) {
                message.error('Lỗi đồng bộ giỏ hàng');
                setCartItems(prevCart); // Revert nếu lỗi
            }
        } else {
            // Lưu LocalStorage
            updateLocalStorage([...cartItems, newItem]); // Lưu ý logic merge
        }
    };

    // 3. Update Quantity
    const updateQuantity = async (variantId: number, qty: number) => {
        if (qty <= 0) return removeFromCart(variantId);

        if (isLoggedIn) {
            await updateCartQuantityApi(variantId, qty);
            // Refresh lại cart từ API để đảm bảo đồng bộ
            const items = await getCartApi();
            setCartItems(items);
        } else {
            setCartItems(prev => {
                const newCart = prev.map(i =>
                    i.variantId === variantId ? { ...i, quantity: qty } : i
                );
                updateLocalStorage(newCart);
                return newCart;
            });
        }
    };

    // 4. Remove
    const removeFromCart = async (variantId: number) => {
        if (isLoggedIn) {
            await removeCartItemApi(variantId);
            setCartItems(prev => prev.filter(i => i.variantId !== variantId));
        } else {
            setCartItems(prev => {
                const newCart = prev.filter(i => i.variantId !== variantId);
                updateLocalStorage(newCart);
                return newCart;
            });
        }
    };

    const clearCart = () => setCartItems([]);

    const updateLocalStorage = (items: CartItem[]) => {
        localStorage.setItem('CART_GUEST', JSON.stringify(items));
    };

    return (
        <CartContext.Provider
            value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext)!;
