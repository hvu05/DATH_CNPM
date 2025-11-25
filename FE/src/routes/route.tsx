import { createBrowserRouter } from 'react-router';
import { AppLayout } from '@/layout';

import { adminRoutes } from './admin.route';
import { authRoutes } from './auth.route';
import { sellerRoutes } from './seller.route';
import { errorRoutes } from './error.route';
import { clientRoutes } from './client.route';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout />,
        children: [
            {
                index: true,
                element: <div className="h-screen">This is homepage</div>,
            },
        ],
    },
    ...authRoutes,
    ...sellerRoutes,
    ...clientRoutes,
    ...adminRoutes,
    ...errorRoutes,
]);
