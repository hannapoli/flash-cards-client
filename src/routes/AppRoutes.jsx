import { Route, Routes, Navigate } from 'react-router'
import { AdminCard, AdminCategories, AdminDashboardPage, AdminLanguages, AdminUserCreate, AdminUserManagement, AdminUserModify, AdminWords, HomePage, LoginPage, RegisterPage, UserDashboardPage } from '../pages'
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

                    <Route path='users' element={<AdminUserManagement />} />
                    <Route path='users/create' element={<AdminUserCreate />} />
                    <Route path='users/modify/:firebase_uid' element={<AdminUserModify />} />

                    <Route path='languages' element={<AdminLanguages />} />
                    <Route path='categories' element={<AdminCategories />} />
                    <Route path='words' element={<AdminWords />} />
                    <Route path='card' element={<AdminCard />} />
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
