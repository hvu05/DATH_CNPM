import { type RouteObject } from 'react-router';
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

export const clientRoutes: RouteObject[] = [
    {
        path: '/client',
        element: (
            <ProtectedRoute allow={'CUSTOMER'}>
                <ClientLayout />
            </ProtectedRoute>
        ),
        // element: <ClientLayout />,
        children: [
            {
                index: true,
                element: <ProfilePageClient />,
            },
            {
                // have tab
                path: 'edit-profile',
                element: <EditProfileClient />,
            },
            {
                // have tab
                path: 'my-orders',
                element: <ClientOrder />,
            },
            {
                // have tab
                path: 'address',
                element: <ClientAddress />,
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
            // {
            //     path: 'history',
            //     element: <ClientHistory />
            // },
        ],
    },
];
