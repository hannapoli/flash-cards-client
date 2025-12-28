import { Route, Routes, Navigate } from 'react-router'
import { AdminDashboardPage, HomePage, LoginPage, RegisterPage, UserDashboardPage } from '../pages'
import { AdminLayout } from '../pages/templates/AdminLayout'
import { UserLayout } from '../pages/templates/UserLayout'
import { PrivateRoutes } from './PrivateRoutes'

export const AppRoutes = () => {
    return (
        <>
            <Routes>
                {/* Rutas públicas */}
                <Route path='/' element={<HomePage />} />
                <Route path='/auth/register' element={<RegisterPage />} />
                <Route path='/auth/login' element={<LoginPage />} />

                {/* Rutas protegidas para el rol de administrador */}
                <Route 
                    path='/admin' 
                    element={
                        <PrivateRoutes allowedRoles={['admin']}>
                            <AdminLayout />
                        </PrivateRoutes>
                    }
                >
                    <Route path='dashboard' element={<AdminDashboardPage />} />
                    {/* otras rutas de admin */}
                </Route>

                {/* Rutas protegidas para el rol de usuario */}
                <Route 
                    path='/user' 
                    element={
                        <PrivateRoutes allowedRoles={['user']}>
                            <UserLayout />
                        </PrivateRoutes>
                    }
                >
                    <Route path='dashboard' element={<UserDashboardPage />} />
                    {/* otras rutas de user */}
                </Route>

                {/* Ruta de redirección */}
                <Route path='/*' element={<Navigate to={'/'} />} />
            </Routes>
        </>
    )
}
