import { Outlet } from 'react-router-dom';
import { Header } from '@/components/layout/header';
import { TabClient } from '@/components/client/tab';

export const ClientLayout = () => {
    return (
        <div className="seller-layout">
            <Header />
            <div className="seller-layout__main-content">
                <TabClient />
                <Outlet />
            </div>
        </div>
    );
};
