import React, { createContext, useContext, useState, useEffect } from 'react';

// Dựa trên schema DB, Guest Cart cần lưu variantId để sau này checkout tạo OrderItem
export interface CartItem {
    productId: number;
    variantId: number; // Quan trọng
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
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        try {
            const stored = localStorage.getItem('GUEST_CART');
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('GUEST_CART', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (newItem: CartItem) => {
        setCartItems(prev => {
            // Check trùng variantId thì cộng dồn số lượng
            const exist = prev.find(i => i.variantId === newItem.variantId);
            if (exist) {
                return prev.map(i =>
                    i.variantId === newItem.variantId
                        ? { ...i, quantity: i.quantity + newItem.quantity }
                        : i
                );
            }
            return [...prev, newItem];
        });
    };

    const removeFromCart = (variantId: number) => {
        setCartItems(prev => prev.filter(i => i.variantId !== variantId));
    };

    const updateQuantity = (variantId: number, qty: number) => {
        if (qty <= 0) return removeFromCart(variantId);
        setCartItems(prev =>
            prev.map(i => (i.variantId === variantId ? { ...i, quantity: qty } : i))
        );
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
