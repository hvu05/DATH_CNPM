import type { RouteObject } from 'react-router-dom';
import Error_404 from '@/pages/error/error.404';

export const errorRoutes: RouteObject[] = [
    {
        path: '/error-404',
        element: <Error_404 />,
    },
];
