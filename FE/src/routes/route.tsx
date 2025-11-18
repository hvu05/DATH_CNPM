import { createBrowserRouter, type RouteObject } from 'react-router';
import { AppLayout } from '@/layout';
import { DetailPage } from '@/pages/seller/detail/detail';
import { ClientLayout } from '@/pages/client/layout/layout.tsx';
import { ClientOrder } from '@/pages/client/myOrders/orders.tsx';
import { ClientAddress } from '@/pages/client/address';
// import { ClientHistory } from "@/pages/client/history";
import { ProfilePageClient } from '@/pages/client/profile/client.profile.tsx';
import { EditProfileClient } from '@/pages/client/profile/edit.profile.tsx';
import { OrderClient } from '@/pages/client/order';
import { PaymentClient } from '@/pages/client/payment';
import { OrderSuccess } from '@/pages/client/order-success';
import { adminRoutes } from './admin.route';
import { authRoutes } from './auth.route';
import { sellerRoutes } from './seller.route';
import { errorRoutes } from './error.route';

const clientRoutes: RouteObject[] = [
    {
        path: '/client',
        // element: <ProtectedRoute allow={'CUSTOMER'}><ClientLayout /></ProtectedRoute>,
        element: <ClientLayout />,
        children: [
            {
                index: true,
                element: <ProfilePageClient />,
            },
            {
                path: 'edit-profile',
                element: <EditProfileClient />,
            },
            {
                path: 'my-orders',
                element: <ClientOrder />,
            },
            {
                path: 'address',
                element: <ClientAddress />,
            },
            // {
            //     path: 'history',
            //     element: <ClientHistory />
            // },
        ],
    },
];

export const router = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout />,
        children: [
            {
                index: true,
                element: <div className="h-screen">This is homepage</div>,
            },
            {
                path: '/seller/order/:id',
                element: <DetailPage />,
            },
            {
                path: '/client/order/:id',
                element: <OrderClient />,
            },
            {
                path: '/client/order/payment',
                element: <PaymentClient />,
            },
            {
                path: '/client/order/success',
                element: <OrderSuccess />,
            },
        ],
    },
    ...authRoutes,
    ...sellerRoutes,
    ...clientRoutes,
    ...adminRoutes,
    ...errorRoutes,
]);
