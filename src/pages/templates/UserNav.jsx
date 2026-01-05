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
                        to='/user/lang'
                        className={({ isActive }) => isActive ? 'nav-link-active' : ''}>
                        Idiomas
                    </NavLink>
                </li>
                <li>
                    <Link to='/' onClick={handleLogout} className='nav-link-active'>Logout</Link>
                </li>
            </ul>
        </nav>
    )
}
