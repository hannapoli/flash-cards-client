import { Route, Routes, Navigate } from 'react-router'
import { AdminCard, AdminCategories, AdminCategoriesCreate, AdminCategoriesModify, AdminDashboardPage, AdminLangCreate, AdminLangModify, AdminLanguages, AdminUserCreate, AdminUserManagement, AdminUserModify, AdminWords, AdminWordsCreate, AdminWordsModify, HomePage, LoginPage, RegisterPage, UserDashboardPage } from '../pages'
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

                    <Route path='lang' element={<AdminLanguages />} />
                    <Route path='lang/create' element={<AdminLangCreate />} />
                    <Route path='lang/modify/:language_id' element={<AdminLangModify />} />

                    <Route path='categories/:language_id' element={<AdminCategories />} />
                    <Route path='categories/create/:language_id' element={<AdminCategoriesCreate />} />
                    <Route path='categories/modify/:category_id' element={<AdminCategoriesModify />} />

                    <Route path='words/:category_id' element={<AdminWords />} />
                    <Route path='words/create/:category_id' element={<AdminWordsCreate />} />
                    <Route path='words/modify/:word_id' element={<AdminWordsModify />} />

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
