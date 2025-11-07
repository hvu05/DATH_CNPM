import { Navigate, type RouteObject } from 'react-router';
import { ProtectedRoute } from './protected.route';
import { AdminLayout } from '@/pages/admin/admin.layout';
import { DashboardPage } from '@/pages/admin/admin.dashboard';
import { ProductPage } from '@/pages/admin/admin.products';
import { UsersPage } from '@/pages/admin/admin.users';
import { RevenuePage } from '@/pages/admin/admin.revenue';
import { InventoryStoragePage } from '@/pages/admin/admin.invetory.storage';
import { InventoryHistoryPage } from '@/pages/admin/admin.inventory.history';

export const adminRoutes: RouteObject[] = [
    {
        path: '/admin',
        element: (
            <ProtectedRoute allow={'ADMIN'}>
                <AdminLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <Navigate to={'/admin/dashboard'} replace />,
            },
            {
                path: 'dashboard',
                element: <DashboardPage />,
            },
            {
                path: 'products',
                element: <ProductPage />,
            },
            {
                path: 'users',
                element: <UsersPage />,
            },
            {
                path: 'revenue',
                element: <RevenuePage />,
            },
            {
                path: 'inventory-static',
                element: <InventoryStoragePage />,
            },
            {
                path: 'inventory-history',
                element: <InventoryHistoryPage />,
            },
        ],
    },
];
