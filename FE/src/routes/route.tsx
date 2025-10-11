import { createBrowserRouter } from "react-router";
import { AppLayout } from "@/layout";
import { LoginPage } from "@/pages/auth/login";
import { ConfirmPage } from "@/pages/auth/confirm";
import { OtpPage } from "@/pages/auth/otp";
import { ResetPasswordPage } from "@/pages/auth/reset";
import { SellerLayout } from "@/pages/seller/layout/layout";

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
        element: <SellerLayout/>,
        children: [
            {
                path: 'profile',
                element: <div>This is seller profile page</div>
            }
        ]
    }
]);