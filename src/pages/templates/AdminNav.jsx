import { Link, NavLink, useNavigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth';

export const AdminNav = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = async (e) => {
        e.preventDefault();
        await logout();
        navigate('/');
    };
    return (
        <nav>
            <ul className='nav'>
                <li>
                    <NavLink
                        to='/admin/dashboard'
                        className={({ isActive }) => isActive ? 'nav-link-active' : ''}>
                        Panel de control
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to='/admin/users'
                        className={({ isActive }) => isActive ? 'nav-link-active' : ''}>
                        Usuarios
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to='/admin/languages'
                        className={({ isActive }) => isActive ? 'nav-link-active' : ''}>
                        Idiomas
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to='/admin/categories'
                        className={({ isActive }) => isActive ? 'nav-link-active' : ''}>
                        Categorías
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to='/admin/words'
                        className={({ isActive }) => isActive ? 'nav-link-active' : ''}>
                        Palabras
                    </NavLink>
                </li>
                <li>
                    <Link to='/' onClick={handleLogout} className='nav-link-active'>Logout</Link>
                </li>
            </ul>
        </nav>
    )
}
