import { Header } from "@/components/layout/header"
import { Outlet } from "react-router"
import './layout.scss'
import { ScrollTop } from "./components/common/scrollTop"

export const AppLayout = () => {
    return (
        <>
            <div className="layout-container">
                <ScrollTop />
                <Header />
                <Outlet />
            </div>
        </>
    )
}