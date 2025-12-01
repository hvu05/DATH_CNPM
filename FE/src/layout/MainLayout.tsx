// FE/src/layout/MainLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { ScrollTop } from '@/components/common/scrollTop';

const MainLayout: React.FC = () => {
    return (
        <div>
            <ScrollTop />
            <Header />
            <main style={{ paddingTop: '80px', minHeight: 'calc(100vh - 80px)' }}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
