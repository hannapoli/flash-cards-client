import { getFirebaseErrorMessage } from '../helpers/firebaseErrorMessages';
import { useEffect, useState } from 'react';
import { auth } from '../firebase/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { AuthContext } from './AuthContext';
import { useFetch } from '../hooks/useFetch';

/**
 * Proveedor del contexto de autenticación
 * Gestiona el estado de autenticación de usuarios con Firebase y PostgreSQL
 * @module contexts/AuthProvider
 * @param {Object} props - Props del componente
 * @param {React.ReactNode} props.children - Componentes hijos que tendrán acceso al contexto
 * @returns {JSX.Element} Proveedor de contexto de autenticación
 * 
 * @description
 * Este componente maneja:
 * - Autenticación con Firebase Authentication
 * - Sincronización con backend PostgreSQL para roles y datos de usuario
 * - Persistencia de sesión
 * - Estados de carga y errores
 * - Operaciones de registro, login, logout, recuperación de contraseña
 * 
 * @example
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authError, setAuthError] = useState(null);
    const [isRegistering, setIsRegistering] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    const { fetchData, loading, setLoading } = useFetch();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    /**
     * Effect hook que escucha cambios en el estado de autenticación de Firebase
     * Sincroniza los datos del usuario con el backend cuando inicia sesión
     */
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (isRegistering) return;

            if (firebaseUser) {
                try {
                    const token = await firebaseUser.getIdToken();

                    // Pedimos al backend los datos del rol y nombre del usuario de PostgreSQL
                    const userData = await fetchData(
                        `${backendUrl}/auth/me`,
                        'GET',
                        null,
                        token
                    );
                    // console.log({ userData });

                    const newUser = {
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        name: userData.name,
                        role: userData.role
                    };
                    setUser(newUser);
                } catch (error) {
                    console.error('Error al obtener datos del usuario:', error);
                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email
                    });
                } finally {
                    setInitialLoading(false);
                }
            } else {
                setUser(null);
                setInitialLoading(false);
            }
        });

        return () => unsubscribe();
    }, [backendUrl, fetchData, isRegistering]);

    /**
     * Registra un nuevo usuario en Firebase y PostgreSQL
     * @param {Object} formData - Datos del formulario de registro
     * @param {string} formData.email - Email del usuario
     * @param {string} formData.password - Contraseña del usuario
     * @param {string} formData.name - Nombre del usuario
     * @returns {Promise<void>}
     * @throws {Error} Si el registro falla
     */
    const register = async (formData) => {
        setAuthError(null);
        setLoading(true);
        setIsRegistering(true);

        try {
            // Creamos el usuario en Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const firebaseUser = userCredential.user;
            // console.log({user});

            const token = await firebaseUser.getIdToken();
            // console.log(token, 'user token durante el registro');

            // Mandamos los datos del usuario al backend (para guardarlos en Firestore y PostgreSQL)
            const payload = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                name: formData.name
            };

            await fetchData(
                `${backendUrl}/auth/register`,
                'POST',
                payload
            );

            // Al registrarse cerramos la sesión para después iniciar sesión manualmente
            await signOut(auth);

        } catch (error) {
            setAuthError(getFirebaseErrorMessage(error));
            throw error;
        } finally {
            setIsRegistering(false);
            setLoading(false);
        }
    };

    /**
     * Crea un nuevo usuario desde el panel de administración
     * Solo disponible para usuarios con rol 'admin'
     * @param {Object} formData - Datos del formulario
     * @param {string} formData.email - Email del usuario
     * @param {string} formData.password - Contraseña del usuario
     * @param {string} formData.name - Nombre del usuario
     * @param {string} [formData.role='user'] - Rol del usuario ('user' o 'admin')
     * @returns {Promise<void>}
     * @throws {Error} Si la creación falla
     */
    const adminCreateUser = async (formData) => {
        setAuthError(null);
        setLoading(true);

        try {
            //Recibimos el tokel del admin
            const adminToken = await auth.currentUser.getIdToken();
            // console.log(adminToken, 'admin token durante la creación de usuario');

            // Mandamos los datos del usuario al backend (para crear el usuario en Firebase, Firestore y PostgreSQL)
            const payload = {
                email: formData.email,
                password: formData.password,
                name: formData.name,
                role: formData.role || 'user'
            };

            await fetchData(
                `${backendUrl}/admin/users/create`,
                'POST',
                payload,
                adminToken
            );

        } catch (error) {
            setAuthError(getFirebaseErrorMessage(error));
            throw error;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Inicia sesión con email y contraseña
     * @param {Object} formData - Datos del formulario de login
     * @param {string} formData.email - Email del usuario
     * @param {string} formData.password - Contraseña del usuario
     * @returns {Promise<void>}
     * @throws {Error} Si el login falla
     */
    const login = async (formData) => {
        setAuthError(null);
        setLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
            const firebaseUser = userCredential.user;
            console.log({ firebaseUser })

        } catch (error) {
            setAuthError(getFirebaseErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    /**
     * Inicia sesión con Google utilizando Firebase Authentication
     * @returns {Promise<void>}
     * @throws {Error} Si el login con Google falla
     */
    const loginWithGoogle = async () => {
        setAuthError(null);
        setLoading(true);

        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            // Ignorar el error si el usuario cerró el popup intencionalmente
            if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
                setAuthError(getFirebaseErrorMessage(error));
            }
        } finally {
            setLoading(false);
        }
    }

    /**
     * Cierra la sesión del usuario actual
     * @returns {Promise<void>}
     * @throws {Error} Si el cierre de sesión falla
     */
    const logout = async () => {
        setLoading(true);
        try {
            return await signOut(auth);
        } catch (error) {
            setAuthError(error.message || 'Error al cerrar sesión. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Envía un email de recuperación de contraseña
     * @param {string} email - Email del usuario
     * @returns {Promise<void>}
     */
    const resetPassword = async (email) => {
        setAuthError(null);
        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
        } catch (error) {
            setAuthError(getFirebaseErrorMessage(error));
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const value = {
        user,
        isLogged: user !== null,
        role: user?.role || null,
        loading,
        initialLoading,
        authError,
        setAuthError,
        register,
        adminCreateUser,
        login,
        loginWithGoogle,
        logout,
        resetPassword
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}