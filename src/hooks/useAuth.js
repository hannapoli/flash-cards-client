import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
/**
 * Custom hook para acceder al contexto de autenticación
 * @module hooks/useAuth
 * @returns {Object} Contexto de autenticación
 * @property {Object|null} user - Usuario autenticado con sus datos (uid, email, name, role)
 * @property {boolean} isLogged - Indica si hay un usuario autenticado
 * @property {string|null} role - Rol del usuario ('user' o 'admin')
 * @property {boolean} loading - Estado de carga de operaciones de autenticación
 * @property {boolean} initialLoading - Estado de carga inicial al verificar la sesión
 * @property {string|null} authError - Mensaje de error de autenticación
 * @property {function} setAuthError - Función para establecer errores de autenticación
 * @property {function} register - Función para registrar un nuevo usuario
 * @property {function} adminCreateUser - Función para que admin cree usuarios
 * @property {function} login - Función para iniciar sesión
 * @property {function} logout - Función para cerrar sesión
 * @property {function} resetPassword - Función para enviar email de recuperación
 * @property {function} changePassword - Función para cambiar contraseña
 * @throws {Error} Si se usa fuera de un AuthProvider
 * 
 * @example
 * const { user, isLogged, login, logout } = useAuth();
 * 
 * if (isLogged) {
 *   console.log(`Usuario: ${user.name}, Rol: ${user.role}`);
 * }
 */export const useAuth = () => {
    return useContext(AuthContext);
}
