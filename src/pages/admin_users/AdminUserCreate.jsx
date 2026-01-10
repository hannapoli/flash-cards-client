import {useNavigate } from 'react-router';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export const AdminUserCreate = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: ''
  });
  const [createSuccess, setCreateSuccess] = useState('');

  const { loading, authError, setAuthError, adminCreateUser } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setAuthError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreateSuccess('');
    setAuthError(null);
    setTimeout(() => {
      navigate('/admin/users');
    } , 2500);
    try {
      await adminCreateUser(formData);
      setCreateSuccess('Usuario creado correctamente.');
    } catch (error) {
      setAuthError(error.message || 'Error al registrarse');
    }
  };

  return (
    <>
      <article className='flexColumn centeredContent'>
      <h1>Gestión de usuarios</h1>
        <h2>Crear nuevo usuario</h2>

        {createSuccess && <p className='successMessage'>{createSuccess}</p>}
        {authError && <p className='errorMessage'>{authError}</p>}

        <form onSubmit={handleSubmit} className='flexColumn centeredContent'>
          <div className='flexColumn'>
            <label htmlFor='name'>Nombre:</label>
            <input
              type='text'
              name='name'
              id='name'
              placeholder='Nombre'
              value={formData.name}
              onChange={handleChange}
              noValidate
            />
          </div>

          <div className='flexColumn'>
            <label htmlFor='email'>Email:</label>
            <input
              type='email'
              name='email'
              id='email'
              placeholder='Email'
              value={formData.email}
              onChange={handleChange}
              noValidate
            />
          </div>

          <div className='flexColumn'>
            <label htmlFor='password'>Contraseña:</label>
            <input
              type='password'
              name='password'
              id='password'
              placeholder='Contraseña'
              value={formData.password}
              onChange={handleChange}
              noValidate
            />
          </div>

          <div className='flexColumn'>
            <label htmlFor='role'>Role:</label>
            <select
              name='role'
              id='role'
              value={formData.role}
              onChange={handleChange}
              noValidate
            >
              <option value=''>Selecciona un rol</option>
              <option value='user'>User</option>
              <option value='admin'>Admin</option>
            </select>
          </div>
          <button type='submit' disabled={loading}>
            {loading ? 'Creando...' : 'Crear usuario'}
          </button>
        </form>
      </article>
    </>
  )
}
