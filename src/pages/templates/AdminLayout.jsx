import { Outlet } from 'react-router';
import { AdminNav } from './AdminNav';
import { Header } from '../../components/Header';

export const AdminLayout = () => {
    return (
        <>
            <Header>
                <AdminNav />
            </Header>
            <main>
                <Outlet />
            </main>
        </>
    );
};
