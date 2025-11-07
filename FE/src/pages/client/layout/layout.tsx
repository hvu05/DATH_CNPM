import { Outlet } from "react-router-dom";
// import './layout.scss'
import { Header } from "@/components/seller/layout/header";
import { TabClient } from "@/components/client/tab";

export const ClientLayout = () => {
  return (
    <>
      <div className="seller-layout">
        <Header />
        <div className="seller-layout__main-content">
          <TabClient />
          <Outlet />
        </div>
      </div>
    </>
  );
};
