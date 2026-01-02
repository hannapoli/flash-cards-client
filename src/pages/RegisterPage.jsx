import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const { register, loading, authError, setAuthError } = useAuth();
  const navigate = useNavigate();

  //Limpiar error al cambiar datos del formulario
  useEffect(() => {
    setAuthError(null);
  }, [setAuthError]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate('/auth/login', {
        state: { message: '¡Gracias por registrarte! Por favor, inicia la sesión.' }
      });
    } catch (error) {
      setAuthError(error.message || 'Error al registrarse');
    }
  };

  return (
    <>
      <h1>¡Empieza a mejorar tu vocabulario hoy!</h1>
      <section>
        <h2>Registrarse</h2>

        {authError && <p className='errorMessage'>{authError}</p>} {/* Añadir la clase a Scss */}

        <form onSubmit={handleSubmit}>
          <div>
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

          <div>
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

          <div>
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
          <button type='submit' disabled={loading}>
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>
        <div>
          Ya tienes una cuenta? <Link to='/auth/login'>Inicia sesión</Link>
        </div>
      </section>
    </>
  )
}
