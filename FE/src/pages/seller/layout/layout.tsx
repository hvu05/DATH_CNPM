import { Outlet } from 'react-router-dom';
import './layout.scss';
import { Header } from '@/components/seller/layout/header';
import { Tab } from '@/components/seller/tab';
import { ScrollTop } from '@/components/common/scrollTop';

export const SellerLayout = () => {
    return (
        <>
            <div className="seller-layout">
                <ScrollTop />
                <Header />
                <div className="seller-layout__main-content">
                    <Tab />
                    <Outlet />
                </div>
            </div>
        </>
    );
};
