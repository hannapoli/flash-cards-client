import { Navigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

export const PrivateRoutes = ({ children, allowedRoles }) => {
    const { role, isLogged, initialLoading } = useAuth();

    if (initialLoading) {
        return <div>Cargando...</div>;
    }

    if (!isLogged || !allowedRoles.includes(role)) {
        return <Navigate to='/' />;
    };

    return children;
}
