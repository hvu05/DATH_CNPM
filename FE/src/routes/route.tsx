import { createBrowserRouter } from "react-router";
import { TestPage } from '@/pages/test'

export const router = createBrowserRouter([
    {
        path: "/",
        element: <TestPage />,
    },
]);