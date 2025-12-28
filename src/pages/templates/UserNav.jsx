import { NavLink } from 'react-router';

export const UserNav = () => {
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
                    <NavLink
                        to='/user/logout'
                        className={({ isActive }) => isActive ? 'nav-link-active' : ''}>
                        Logout
                    </NavLink>
                </li>
            </ul>
        </nav>
    )
}
