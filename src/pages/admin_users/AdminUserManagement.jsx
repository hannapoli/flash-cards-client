import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useFetch } from '../../hooks/useFetch';
import { auth } from '../../firebase/firebaseConfig';
import { DeletePopUp } from '../../components/DeletePopUp';
import { InfoList } from '../../components/InfoList';
import findUidByEmail from '../../helpers/findUidByEmail';

export const AdminUserManagement = () => {
  const [email, setEmail] = useState('');
  const [foundUser, setFoundUser] = useState(null);
  const [searchError, setSearchError] = useState(null);
  const [users, setUsers] = useState([]);

  const [userToDelete, setUserToDelete] = useState(null);

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState('');

  const { fetchData, loading } = useFetch();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  //Mostrar todos los usuarios al cargar la página
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        const response = await fetchData(
          `${backendUrl}/admin/users/getall`,
          'GET',
          null,
          token
        );
        setUsers(response.users || []);
      } catch (error) {
        console.error('Error al cargar usuarios:', error);
      }
    };
    loadUsers();
  }, [backendUrl, fetchData]);


  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchError(null);
    setFoundUser(null);

    if (!email.trim()) {
      setSearchError('Ingresa un email');
      return;
    }

    //Buscamos el uid en Firestore por el email
    const firebaseUid = await findUidByEmail(email, setSearchError);

    // Con el uid, buscamos el usuario en el backend
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
    if (!userToDelete) return;
    setDeleteLoading(true);
    setDeleteError(null);
    setDeleteSuccess('');
    try {
      const token = await auth.currentUser?.getIdToken();
      await fetchData(
        `${backendUrl}/admin/users/delete/${userToDelete.firebase_uid}`,
        'DELETE',
        null,
        token
      );
      setShowDeletePopup(false);
      setUsers(users.filter(user => user.firebase_uid !== userToDelete.firebase_uid));
      if (foundUser?.firebase_uid === userToDelete.firebase_uid)
        setFoundUser(null);
      setEmail('');
      setUserToDelete(null);
      setDeleteSuccess('Se ha eliminado el usuario correctamente.');
    } catch (error) {
      setDeleteError(error.message || 'Error al eliminar el usuario');
    } finally {
      setDeleteLoading(false);
    }
  };

  const openDeletePopup = (user) => {
    setUserToDelete(user);
    setShowDeletePopup(true);
  };

  return (
    <>
      <section className='flexColumn centeredContent'>
        <h1>Gestión de usuarios</h1>
        <Link to='/admin/users/create'>
          <button className='marginTop marginBottom confirmBtn'>Crear nuevo usuario</button>
        </Link>

        <form onSubmit={handleSearch} className='flexColumn centeredContent'>
          <div className='flexColumn'>
            <label htmlFor='email' className='centeredLabel marginTop marginB'>Buscar usuario por email:</label>
            <input
              type='email'
              id='email'
              placeholder='Escribe el email del usuario...'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              noValidate
            />
          </div>
          <button type='submit' disabled={loading} className='marginTop confirmBtn'>
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </form>

        {deleteSuccess && <p className='successMessage'>{deleteSuccess}</p>}
        {searchError && <p className='errorMessage'>{searchError}</p>}
        {foundUser && (
          <article className='flexColumn centeredContent'>
            <h2>Información del usuario encontrado:</h2>
            <h3>{foundUser.name}</h3>
            <p><span className='bold'>UID:</span> {foundUser.firebase_uid}</p>
            <p><span className='bold'>Email:</span> {foundUser.email}</p>
            <p><span className='bold'>Role:</span> {foundUser.role}</p>

            <div className='userManagementActions'>
              <Link to={`/admin/users/modify/${foundUser.firebase_uid}`} state={{ user: foundUser }}>
                <button>Modificar</button>
              </Link>
              <button onClick={() => openDeletePopup(foundUser)} className='deleteBtn'>Eliminar</button>
            </div>
          </article>
        )}
        <h2 className='marginTop marginBottom'>Lista de todos los usuarios:</h2>
        <section className='userList'>
          {loading && <p>Cargando usuarios...</p>}
          {users.length === 0 && !loading && <p>No hay usuarios registrados.</p>}
          {users.map((user) => (
            <InfoList
              key={user.firebase_uid}
              itemObject={user}
              stateObject={{ user: user }}
              onModifyPath={`/admin/users/modify/${user.firebase_uid}`}
              onDelete={openDeletePopup}
            />
          ))}
        </section>
      </section>

      {/* Popup para eliminar el usuario seleccionado */}
      {showDeletePopup && userToDelete && (
        <DeletePopUp
          type='este usuario'
          item={userToDelete.email}
          onConfirm={handleDeleteUser}
          onCancel={() => {
            setShowDeletePopup(false);
            setUserToDelete(null);
          }}
          loading={deleteLoading}
          error={deleteError}
        />
      )}
    </>
  );
}