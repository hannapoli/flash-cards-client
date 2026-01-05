import { useState } from 'react';
import { useLocation } from 'react-router';
import { useFetch } from '../../hooks/useFetch';
import { auth } from '../../firebase/firebaseConfig';

export const AdminUserModify = () => {
  const location = useLocation();
  const { user: foundUser } = location.state || {};

  const [formData, setFormData] = useState({
    name: foundUser?.name || '',
    email: foundUser?.email || '',
    role: foundUser?.role || ''
  });
  const [modifyError, setModifyError] = useState(null);
  const [modifyLoading, setModifyLoading] = useState(false);
  const [modifySuccess, setModifySuccess] = useState('');

  const { fetchData } = useFetch();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleModifyUser = async (e) => {
    e.preventDefault();
    setModifyLoading(true);
    setModifyError(null);
    setModifySuccess('');
    try {
      if (!foundUser) {
        setModifyError('No se ha encontrado el usuario.');
        return;
      }
      const token = await auth.currentUser?.getIdToken();
      await fetchData(
        `${backendUrl}/admin/users/edit/${foundUser.firebase_uid}`,
        'PUT',
        {
          name: formData.name,
          email: formData.email,
          role: formData.role
        },
        token
      );
      setModifySuccess('Usuario modificado correctamente.');
    } catch (error) {
      setModifyError(error.message || 'Error al modificar el usuario.');
    } finally {
      setModifyLoading(false);
    }
  };

  return (
    <>
      <h1>Gestión de usuarios</h1>

      <article className='userDetails'>
        <h2>Modificar usuario</h2>
        {modifySuccess && <p className='successMessage'>{modifySuccess}</p>}
        {modifyError && <p className='errorMessage'>{modifyError}</p>}

        <form onSubmit={handleModifyUser}>
          <div>
            <label htmlFor='firebase_uid'>Firebase UID:</label>
            <input
              /* scss cursor: 'not-allowed' */
              type='text'
              id='firebase_uid'
              value={foundUser.firebase_uid}
              disabled
              noValidate
            />
          </div>

          <div>
            <label htmlFor='name'>Nombre:</label>
            <input
              type='text'
              id='name'
              name='name'
              placeholder='Nombre'
              value={formData.name}
              onChange={handleChange}
              noValidate

            />
          </div>

          <div>
            <label htmlFor='email'>Email:</label>
            <input
              type='email'
              id='email'
              name='email'
              placeholder='Email'
              value={formData.email}
              onChange={handleChange}
              noValidate

            />
          </div>

          <div>
            <label htmlFor='role'>Role:</label>
            <select
              id='role'
              name='role'
              value={formData.role}
              onChange={handleChange}
              noValidate
            >
              <option value=''>Selecciona un rol</option>
              <option value='user'>User</option>
              <option value='admin'>Admin</option>
            </select>
          </div>

          <div>
            <button type='submit' disabled={modifyLoading} className='confirmBtn'>
              {modifyLoading ? 'Modificando...' : 'Modificar usuario'}
            </button>
          </div>
        </form>
      </article>
    </>
  );
}
