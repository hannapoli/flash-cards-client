import { getFirebaseErrorMessage } from '../helpers/firebaseErrorMessages';
import { useEffect, useState } from 'react';
import { auth } from '../firebase/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, sendPasswordResetEmail, updatePassword } from 'firebase/auth';
import { AuthContext } from './AuthContext';
import { useFetch } from '../hooks/useFetch';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authError, setAuthError] = useState(null);
    const [isRegistering, setIsRegistering] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    const { fetchData, loading, setLoading } = useFetch();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    //onAuthStateChanged: listener de Firebase a la escucha de cambios en el estado de autenticación
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

    // Función común para crear usuario (usada en register y adminCreateUser).
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

    // Registro de usuario por parte del admin
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

    const resetPassword = (email) => {
        return sendPasswordResetEmail(auth, email);
    };

    const changePassword = (newPassword) => {
        return updatePassword(auth.currentUser, newPassword);
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
        logout,
        resetPassword,
        changePassword
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}