import { Navigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

export const PrivateRoutes = ({ children, allowedRoles }) => {
    const { role, isLogged } = useAuth();

    if (!isLogged) {
        return <Navigate to='/auth/login' />;
    };

    if (!allowedRoles.includes(role)) {
        return <Navigate to='/' />;
    }

    return children;
}
