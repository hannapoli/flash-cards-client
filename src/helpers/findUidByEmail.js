import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const findUidByEmail = async (email, setSearchError) => {

    try {
        const search = query(
            collection(db, 'users'),
            where('email', '==', email.trim())
        );

        const querySnapshot = await getDocs(search);
        if (querySnapshot.empty) {
            setSearchError('Usuario no encontrado');
            return;
        }
        const userDoc = querySnapshot.docs[0];
        const firebaseUid = userDoc.id;
        // console.log('Firebase UID encontrado:', firebaseUid);
        return firebaseUid;
    } catch (error) {
        setSearchError('Error al buscar el usuario');
        console.error('Error al buscar el UID por email:', error);
    }
};

export default findUidByEmail;