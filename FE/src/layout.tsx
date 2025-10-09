import { Header } from "@/components/layout/header"
import { Outlet } from "react-router"

export const AppLayout = () => {
    return (
        <>
            <Header />
            <Outlet />
        </>
    )
}