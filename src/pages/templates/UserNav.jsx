import { Link, NavLink, useNavigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';
import './Nav.scss'

export const UserNav = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = async (e) => {
        e.preventDefault();
        await logout();
        navigate('/');
    };
    return (
        <nav className='flexContainer'>
            <Link to='/' className='navLogo'>Flash Cards</Link>

            <div className='navMenuIcon' onClick={toggleMenu}>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <ul className={`navMenu ${isMenuOpen ? 'visible' : ''}`}>
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
                    <Link to='/' onClick={handleLogout}>Logout</Link>
                </li>
            </ul>
        </nav>
    )
}
