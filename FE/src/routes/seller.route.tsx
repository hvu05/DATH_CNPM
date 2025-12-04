import { SellerLayout } from '@/pages/seller/layout/layout';
import { ProfilePage } from '@/pages/seller/profile/profile';
import { EditProfilePage } from '@/pages/seller/profile/edit.profile';
import { OrderPage } from '@/pages/seller/orders/order';
import { StatusPage } from '@/pages/seller/status/status';
import type { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from './protected.route';
import { DetailPage } from '@/pages/seller/detail/detail';

export const sellerRoutes: RouteObject[] = [
    {
        path: '/seller',
        element: (
            <ProtectedRoute allow="STAFF">
                <SellerLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <ProfilePage />,
            },
            {
                path: 'edit-profile',
                element: <EditProfilePage />,
            },
            {
                path: 'myOrders',
                element: <OrderPage />,
            },
            {
                path: 'status',
                element: <StatusPage />,
            },
            {
                path: 'order/:id',
                element: <DetailPage />,
            },
        ],
    },
];
