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

export const router = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [
            {
                index: true,
                element: <div>This is homepage</div>
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
        ]
    },
    // seller route 
    {
        path: '/seller',
        element: <SellerLayout />,
        children: [
            {
                path: 'profile',
                element: <ProfilePage />
            },
            {
                path: 'edit-profile',
                element: <EditProfilePage />
            },
            {
                path: 'orders',
                element: <OrderPage />
            },
            {

            }
        ]
    }
]);