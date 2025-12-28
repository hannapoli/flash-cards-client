import { createContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, sendPasswordResetEmail, updatePassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useFetch } from "../hooks/useFetch";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authError, setAuthError] = useState(null);
    const [isRegistering, setIsRegistering] = useState(false);

    const { fetchData, loading, setLoading } = useFetch();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    //onAuthStateChanged: listener de Firebase que detecta cambios en el estado de autenticación
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
                    console.log({ userData });

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
                }
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, [backendUrl, fetchData, isRegistering]);

    const register = async (formData) => {
        setAuthError(null);
        setLoading(true);
        setIsRegistering(true);

        try {
            // Creamos el usuario en Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const firebaseUser = userCredential.user;
            // console.log({user});

            const token = await firebaseUser.getIdToken();
            // Cerramos sesión para evitar que onAuthStateChanged intente hacer fetch
            await signOut(auth);

            // Creamos un documento con información básica sobre el usuario en Firestore
            await setDoc(doc(db, 'users', firebaseUser.uid), {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                name: formData.name,
                createdAt: new Date().toISOString()
            });

            // Mandamos los datos del usuario al backend (para guardar en PostgreSQL)
            await fetchData(
                `${backendUrl}/auth/register`,
                'POST',
                { name: formData.name },
                //Firebase uid y email los obtiene el backend del token
                token
            );

        } catch (error) {
            console.error('Register error:', error);
            setAuthError(error.message || 'Error al registrarse');
            throw error;
        } finally {
            setIsRegistering(false);
            setLoading(false);
        }
    };

    const login = async (formData) => {
        setAuthError(null);
        setLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
            const firebaseUser = userCredential.user;
            // console.log({ firebaseUser })

        } catch (error) {
            console.error('Login error:', error);
            setAuthError(error.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);

        try {
            return await signOut(auth);
        } catch (error) {
            console.error('Logout error:', error);
            setAuthError(error.message || 'Error al cerrar sesión');
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
        authError,
        setAuthError,
        register,
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

