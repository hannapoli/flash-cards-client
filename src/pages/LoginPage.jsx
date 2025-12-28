import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

export const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const { login, loading, authError, setAuthError, user, role } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const message = location.state?.message || null;

  //Limpiar error al cambiar datos del formulario
  useEffect(() => {
    setAuthError(null);
  }, [setAuthError]);

  // Redirigir ul usuario autenticado a su dashboard según su rol
  useEffect(() => {
    if (user && role) {
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else if (role === 'user') {
        navigate('/user/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [user, role, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData);
  }
  return (
    <>
      <h1>¡Empieza a mejorar tu vocabulario hoy!</h1>
      <section>
        <h2>Iniciar sesión</h2>

        {message && <p className='successMessage'>{message}</p>} {/* Añadir clase */}
        {authError && <p className="errorMessage">{authError}</p>} {/* Añadir la clase a Scss */}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            noValidate
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            noValidate
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>
        <div>
          ¿No tienes una cuenta? <Link to="/auth/register">Regístrate</Link>
        </div>
      </section>
    </>
  )
}
