import { Link, NavLink, useNavigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth';

export const UserNav = () => {
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
                        to='/user/dashboard'
                        className={({ isActive }) => isActive ? 'nav-link-active' : ''}>
                        Panel de control
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to='/user/categories'
                        className={({ isActive }) => isActive ? 'nav-link-active' : ''}>
                        Categorías
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to='/user/words'
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
