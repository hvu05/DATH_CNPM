
import { Outlet } from "react-router"
import './layout.scss'
import { Header } from "@/components/seller/layout/header"
import { Tab } from "@/components/seller/tab"

export const SellerLayout = () => {
    return (
        <>
            <div className="layout-container">
                <Header />
                <div className="main-content">
                    <Tab />
                    <Outlet />
                </div>
            </div>
        </>
    )
}