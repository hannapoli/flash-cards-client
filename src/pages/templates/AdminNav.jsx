import { NavLink } from 'react-router';

export const AdminNav = () => {
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
                    <NavLink
                        to='/admin/logout'
                        className={({ isActive }) => isActive ? 'nav-link-active' : ''}>
                        Logout
                    </NavLink>
                </li>
            </ul>
        </nav>
    )
}
