import { createBrowserRouter } from "react-router";
import { AppLayout } from "@/layout";

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
                element: <div>This is login page</div>
            }
        ]
    },
]);