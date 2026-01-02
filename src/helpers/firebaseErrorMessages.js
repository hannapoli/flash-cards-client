// Los códigos de error de Firebase convertidos en mensajes comprensibles en castellano
const firebaseErrorMessages = {
    'auth/email-already-in-use': 'El correo electrónico ya está en uso.',
    'auth/invalid-email': 'El correo electrónico no es válido.',
    'auth/weak-password': 'La contraseña es demasiado débil. Debe tener al menos 6 caracteres.',
    'auth/user-not-found': 'No existe una cuenta con este correo.',
    'auth/wrong-password': 'La contraseña es incorrecta.',
    'auth/invalid-credential': 'Las credenciales proporcionadas no son válidas.',
    'auth/user-disabled': 'La cuenta ha sido deshabilitada.',
    'auth/too-many-requests': 'Demasiados intentos. Intenta de nuevo más tarde.',
    'auth/operation-not-allowed': 'Operación no permitida. Contacta al administrador.'
};

export function getFirebaseErrorMessage(error) {
    if (!error) return;
    // console.log([error.code]);
    if (error.code && firebaseErrorMessages[error.code]) {
        return firebaseErrorMessages[error.code];
    }
    if (typeof error.message === 'string') {
        for (const code in firebaseErrorMessages) {
            if (error.message.includes(code)) {
                return firebaseErrorMessages.code;
            }
        }
    }
    return error.message || 'Error de Firebase.';
}