import { createBrowserRouter, Navigate, type RouteObject } from 'react-router-dom';
import { AppLayout } from '@/layout';

import { adminRoutes } from './admin.route';
import { authRoutes } from './auth.route';
import { sellerRoutes } from './seller.route';
import { errorRoutes } from './error.route';
import { clientRoutes } from './client.route';
import MainLayout from '@/layout/MainLayout';
import HomePage from '@/pages/guest/HomePage';
import ProductDetailPage from '@/pages/guest/ProductDetailPage';
import CartPage from '@/pages/guest/CartPage';
import SearchPage from '@/pages/guest/SearchPage';
export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: 'product/:id',
                element: <ProductDetailPage />,
            },
            {
                path: 'cart',
                element: <CartPage />,
            },
            {
                path: 'search',
                element: <SearchPage />,
            },
        ],
    },
    ...authRoutes,
    ...sellerRoutes,
    ...clientRoutes,
    ...adminRoutes,
]);
