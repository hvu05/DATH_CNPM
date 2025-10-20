import { createBrowserRouter } from "react-router";
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
import { ClientHistory } from "@/pages/client/history";
import { ProfilePageClient } from "@/pages/client/profile/client.profile.tsx";
import { EditProfileClient } from "@/pages/client/profile/edit.profile.tsx";
import { OrderClient } from "@/pages/client/order";
import { PaymentClient } from "@/pages/client/payment";
import { OrderSuccess } from "@/pages/client/order-success";
import { RegisterPage } from "@/pages/auth/register";

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
                path: '/login',
                element: <LoginPage />
            },
            {
                path: '/user-confirm',
                element: <ConfirmPage />
            },
            {
                path: '/otp',
                element: <OtpPage />
            },
            {
                path: '/reset-pass',
                element: <ResetPasswordPage />
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
            {
                path: '/register',
                element: <RegisterPage />
            }
        ]
    },
    // seller route 
    {
        path: '/seller',
        element: <SellerLayout />,
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
    {
        path: '/client',
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
            {
                path: 'history',
                element: <ClientHistory />
            },

        ]

    }
    // common ? 
]);