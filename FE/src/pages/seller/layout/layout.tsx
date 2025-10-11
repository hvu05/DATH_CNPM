
import { Outlet } from "react-router"
import './layout.scss'
import { Header } from "@/components/seller/layout/header"

export const SellerLayout = () => {
    return (
        <>
            <div className="layout-container">
                <Header />
                <Outlet />
            </div>
        </>
    )
}