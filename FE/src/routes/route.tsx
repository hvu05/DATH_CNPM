import { createBrowserRouter, Navigate, type RouteObject } from "react-router";
import { AppLayout } from "@/layout";
import { LoginPage } from "@/pages/auth/login";
import { ConfirmPage } from "@/pages/auth/confirm";
import { OtpPage } from "@/pages/auth/otp";
import { ResetPasswordPage } from "@/pages/auth/reset";
import { SellerLayout } from "@/pages/seller/layout/layout";
import { ProfilePage } from "@/pages/seller/profile/profile";
import { EditProfilePage } from "@/pages/seller/profile/edit.profile";
import { OrderPage } from "@/pages/seller/orders/order";
import { StatusPage } from "@/pages/seller/status/status";
import { DetailPage } from "@/pages/seller/detail/detail";
import { ClientLayout } from "@/pages/client/layout/layout.tsx";
import { ClientOrder } from "@/pages/client/myOrders/orders.tsx";
import { ClientAddress } from "@/pages/client/address";
// import { ClientHistory } from "@/pages/client/history";
import { ProfilePageClient } from "@/pages/client/profile/client.profile.tsx";
import { EditProfileClient } from "@/pages/client/profile/edit.profile.tsx";
import { AdminLayout } from "@/pages/admin/admin.layout";
import { DashboardPage } from "@/pages/admin/admin.dashboard";
import { ProductPage } from "@/pages/admin/admin.products";
import { UsersPage } from "@/pages/admin/admin.users";
import { OrderClient } from "@/pages/client/order";
import { PaymentClient } from "@/pages/client/payment";
import { OrderSuccess } from "@/pages/client/order-success";
import { RegisterPage } from "@/pages/auth/register";
import { ProtectedRoute } from "./protected.route";

const authRoutes: RouteObject[] = [
    {
        path: '/',
        element: <ProtectedRoute restrictedForAuthenticated={true}><AppLayout /></ProtectedRoute>,
        children: [
            {
                path: '/login',
                element: <LoginPage />
            },
            {
                path: 'register',
                element: <RegisterPage />
            },
            {
                path: 'user-confirm',
                element: <ConfirmPage />
            },
            {
                path: 'otp',
                element: <OtpPage />
            },
            {
                path: 'reset-pass',
                element: <ResetPasswordPage />
            },
        ]
    }
]

const sellerRoutes: RouteObject[] = [
    {
        path: '/seller',
        element: <ProtectedRoute allow="STAFF"><SellerLayout /></ProtectedRoute>,
        children: [
            {
                index: true,
                element: <ProfilePage />
            },
            {
                path: 'edit-profile',
                element: <EditProfilePage />
            },
            {
                path: 'myOrders',
                element: <OrderPage />
            },
            {
                path: 'status',
                element: <StatusPage />
            },
        ]
    },
]

const clientRoutes: RouteObject[] = [
    {
        path: '/client',
        // element: <ProtectedRoute allow={'CUSTOMER'}><ClientLayout /></ProtectedRoute>,
        element: <ClientLayout />,
        children: [
            {
                index: true,
                element: <ProfilePageClient />
            },
            {
                path: 'edit-profile',
                element: <EditProfileClient />
            },
            {
                path: 'my-orders',
                element: <ClientOrder />
            },
            {
                path: 'address',
                element: <ClientAddress />
            },
            // {
            //     path: 'history',
            //     element: <ClientHistory />
            // },

        ]

    }
]

const adminRoutes: RouteObject[] = [
    {
        path: '/admin',
        element: <ProtectedRoute allow={'ADMIN'}><AdminLayout /></ProtectedRoute>,
        children: [
            {
                index: true,
                element: <Navigate to={'/admin/dashboard'} replace />
            },
            {
                path: 'dashboard',
                element: <DashboardPage />
            },
            {
                path: 'products',
                element: <ProductPage />
            },
            {
                path: 'users',
                element: <UsersPage />
            }
        ]
    }
]

export const router = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [
            {
                index: true,
                element: <div className="h-screen">This is homepage</div>
            },
            {
                path: '/seller/order/:id',
                element: <DetailPage />
            },
            {
                path: '/client/order/:id',
                element: <OrderClient />
            },
            {
                path: '/client/order/payment',
                element: <PaymentClient />
            },
            {
                path: '/client/order/success',
                element: <OrderSuccess />
            },

        ]
    },
    ...authRoutes,
    ...sellerRoutes,
    ...clientRoutes,
    ...adminRoutes,
]);