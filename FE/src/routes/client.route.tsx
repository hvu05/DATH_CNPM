import { type RouteObject } from 'react-router-dom';
import { ClientLayout } from '@/pages/client/layout/layout.tsx';
import { ClientOrder } from '@/pages/client/myOrders/orders.tsx';
import { ClientAddress } from '@/pages/client/address';
// import { ClientHistory } from "@/pages/client/history";
import { ProfilePageClient } from '@/pages/client/profile/client.profile.tsx';
import { EditProfileClient } from '@/pages/client/profile/edit.profile.tsx';
import { OrderClient } from '@/pages/client/order';
import { PaymentClient } from '@/pages/client/payment';
import { OrderSuccess } from '@/pages/client/order-success';
import { ProtectedRoute } from './protected.route';
import { AppLayout } from '@/layout';
import { ReOrderClient } from '@/pages/client/reOrder/reOrder';

export const clientRoutes: RouteObject[] = [
    {
        path: '/client',
        element: (
            <ProtectedRoute allow={'CUSTOMER'}>
                <ClientLayout />
            </ProtectedRoute>
        ),
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
        ],
    },
    {
        path: '/client',
        element: <AppLayout />,
        children: [
            {
                path: 'order',
                element: <OrderClient />,
            },
            {
                path: 'order/payment',
                element: <PaymentClient />,
            },
            {
                path: '/client/order/success',
                element: <OrderSuccess />,
            },
            {
                path: '/client/info/:id',
                element: <ReOrderClient />,
            },
        ],
    },
];
