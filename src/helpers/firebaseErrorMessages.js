/**
 * @module helpers/firebaseErrorMessages
 * @description Mapeo de códigos de error de Firebase a mensajes en español
 */

/**
 * Diccionario de códigos de error de Firebase y sus mensajes en español
 * @constant {Object.<string, string>}
 */
const firebaseErrorMessages = {
    'auth/email-already-in-use': 'El correo electrónico ya está en uso.',
    'auth/invalid-email': 'El correo electrónico no es válido.',
    'auth/missing-password': 'La contraseña es obligatoria.',
    'auth/weak-password': 'La contraseña es demasiado débil. Debe tener al menos 6 caracteres.',
    'auth/user-not-found': 'No existe una cuenta con este correo.',
    'auth/wrong-password': 'La contraseña es incorrecta.',
    'auth/invalid-credential': 'Las credenciales proporcionadas no son válidas.',
    'auth/user-disabled': 'La cuenta ha sido deshabilitada.',
    'auth/too-many-requests': 'Demasiados intentos. Intenta de nuevo más tarde.',
    'auth/operation-not-allowed': 'Operación no permitida. Contacta al administrador.',
    'auth/id-token-expired': 'El token de autenticación ha expirado. Por favor, inicia sesión de nuevo.'
};

/**
 * Convierte un error de Firebase en un mensaje legible en castellano
 * @param {Object} error - Objeto de error de Firebase
 * @param {string} [error.code] - Código del error de Firebase
 * @param {string} [error.message] - Mensaje del error
 * @returns {string} Mensaje de error en castellano
 * 
 * @example
 * try {
 *   await signInWithEmailAndPassword(auth, email, password);
 * } catch (error) {
 *   const message = getFirebaseErrorMessage(error);
 *   console.log(message); // "La contraseña es incorrecta."
 * }
 */
export function getFirebaseErrorMessage(error) {
    if (!error) return;
    // console.log([error.code]);
    if (error.code && firebaseErrorMessages[error.code]) {
        return firebaseErrorMessages[error.code];
    }
    if (typeof error.message === 'string') {
        for (const code in firebaseErrorMessages) {
            if (error.message.includes(code)) {
                return firebaseErrorMessages[code];
            }
        }
    }
    return error.message || 'Error de Firebase.';
}