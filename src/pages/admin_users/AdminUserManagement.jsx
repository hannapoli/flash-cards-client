import { useState } from 'react';
import { Link } from 'react-router';
import { useFetch } from '../../hooks/useFetch';
import { auth } from '../../firebase/firebaseConfig';

export const AdminUserManagement = () => {
  const [firebaseUid, setFirebaseUid] = useState('');
  const [foundUser, setFoundUser] = useState(null);
  const [searchError, setSearchError] = useState(null);
  
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState('');

  const { fetchData, loading } = useFetch();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchError(null);
    setFoundUser(null);

    if (!firebaseUid.trim()) {
      setSearchError('Ingresa un Firebase UID');
      return;
    }

    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await fetchData(
        `${backendUrl}/admin/users/get/${firebaseUid}`,
        'GET',
        null,
        token
      );
      // console.log(response.user)
      setFoundUser(response.user);

    } catch (error) {
      setSearchError(error.message || 'Usuario no encontrado');
    }
  };

  const handleDeleteUser = async () => {
    setDeleteLoading(true);
    setDeleteError(null);
    setDeleteSuccess('');
    try {
      const token = await auth.currentUser?.getIdToken();
      await fetchData(
        `${backendUrl}/admin/users/delete/${foundUser.firebase_uid}`,
        'DELETE',
        null,
        token
      );
      setShowDeletePopup(false);
      setFoundUser(null);
      setFirebaseUid('');
      setDeleteSuccess('Se ha eliminado el usuario correctamente.');
    } catch (error) {
      setDeleteError(error.message || 'Error al eliminar el usuario');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <h1>Gestión de usuarios</h1>
      <Link to="/admin/users/create">
        <button>Crear nuevo usuario</button>
      </Link>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Escribe el Firebase UID del usuario"
          value={firebaseUid}
          onChange={(e) => setFirebaseUid(e.target.value)}
          noValidate
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {deleteSuccess && <p className="successMessage">{deleteSuccess}</p>}
      {searchError && <p className="errorMessage">{searchError}</p>}
      {foundUser && (
        <article className="userDetails">
          <h2>Información del usuario:</h2>
          <p>Firebase UID: {foundUser.firebase_uid}</p>
          <p>Nombre: {foundUser.name}</p>
          <p>Email: {foundUser.email}</p>
          <p>Role: {foundUser.role}</p>

          <div className="userManagementActions">
            <Link to={`/admin/users/modify/${foundUser.firebase_uid}`} state={{ user: foundUser }}>
              <button>Modificar</button>
            </Link>
            <button onClick={() => setShowDeletePopup(true)} className='deleteBtn'>Eliminar</button>
          </div>
        </article>
      )}

      {/* Popup para eliminar el usuario seleccionado */}
      {showDeletePopup && foundUser && (
        <article className="popupCard">
          <div className="popupContent">
            <h3>¿Estás seguro que quieres eliminar este usuario?</h3>
            <p>UID: {foundUser.firebase_uid}</p>
            <p>Email: {foundUser.email}</p>
            {deleteError && <p className="errorMessage">{deleteError}</p>}
            <div>
              <button onClick={handleDeleteUser} disabled={deleteLoading} className='confirmBtn'>
                {deleteLoading ? 'Eliminando...' : 'Sí'}
              </button>
              <button onClick={() => setShowDeletePopup(false)} className='cancelBtn'>No</button>
            </div>
          </div>
        </article>
      )}
    </>
  );
}