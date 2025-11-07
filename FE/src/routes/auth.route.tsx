import { LoginPage } from "@/pages/auth/login";
import { ConfirmPage } from "@/pages/auth/confirm";
import { OtpPage } from "@/pages/auth/otp";
import { ResetPasswordPage } from "@/pages/auth/reset";
import { RegisterPage } from "@/pages/auth/register";
import type { RouteObject } from "react-router";
import { AppLayout } from "@/layout";
import { ProtectedRoute } from "./protected.route";

export const authRoutes: RouteObject[] = [
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