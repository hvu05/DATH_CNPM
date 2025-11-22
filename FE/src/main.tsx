import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { router } from '@/routes/route';
import { RouterProvider } from 'react-router-dom';
import '@/styles/global.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { App } from 'antd';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider>
            <App>
                <CartProvider>
                    <RouterProvider router={router} />
                </CartProvider>
            </App>
        </AuthProvider>
    </StrictMode>
);
