import { Outlet } from 'react-router';
import { UserNav } from './UserNav';
import { Header } from '../../components/Header';

export const UserLayout = () => {
    return (
        <>
            <Header>
                <UserNav />
            </Header>
            <main>
                <Outlet />
            </main>
        </>
    );
};
