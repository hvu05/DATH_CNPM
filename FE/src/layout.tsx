import { Header } from "@/components/layout/header"
import { Outlet } from "react-router"
import './layout.scss'

export const AppLayout = () => {
    return (
        <>
            <div className="layout-container">
                <Header />
                <Outlet />
            </div>
        </>
    )
}