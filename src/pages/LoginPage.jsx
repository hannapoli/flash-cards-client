import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { getFirebaseErrorMessage } from '../helpers/firebaseErrorMessages';
import { PopUp } from '../components/PopUp';
import googleIcon from '../assets/images/google.png';

export const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);

  const {
    login,
    loginWithGoogle,
    resetPassword,
    loading,
    authError,
    setAuthError,
    user,
    role
  } = useAuth();
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

  const handleResetPassword = async () => {
    try {
      await resetPassword(resetEmail);
      setResetSent(true);
    } catch (error) {
      setAuthError(getFirebaseErrorMessage(error));
    }
  }

  return (
    <>
      <section className='flexColumn centeredContent'>
        <h1 className='marginTop'>¡Empieza a mejorar tu vocabulario hoy!</h1>
        <h2>Iniciar sesión</h2>

        {message && <p className='successMessage'>{message}</p>}
        {authError && <p className='errorMessage'>{authError}</p>}

        <form onSubmit={handleSubmit} className='flexColumn centeredContent'>
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
          <button type='submit' disabled={loading} className='confirmBtn marginTop'>
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>

          <div className='btns'>
          <button
            onClick={loginWithGoogle}
            className='confirmBtn loginGoogleBtn'
            disabled={loading}>
            <img src={googleIcon} alt='Google' />
            Iniciar sesión con Google
          </button>

          <button onClick={() => setShowPopUp(true)} className='confirmBtn'>Recuperar la contraseña</button>
          </div>

          <div className='marginTop'>
            ¿No tienes una cuenta? <Link to='/auth/register'>Regístrate</Link>
          </div>
      </section>

       {/* PopUp para reestablecer contraseña */}
      <PopUp isOpen={showPopUp} onClose={() => setShowPopUp(false)}>
        <h3>Recuperar contraseña</h3>
        <p>Ingresa tu email para recibir instrucciones de recuperación</p>
        <div className='flexColumn'>
          <input
            type='email'
            name='resetEmail'
            id='resetEmail'
            placeholder='Ingresa tu email'
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            noValidate
          />
        </div>
        <div>
          <button onClick={handleResetPassword} className='confirmBtn marginTop'>
            {loading ? 'Enviando email...' : 'Reestablecer contraseña'}
          </button>
        </div>
        {resetSent && (
          <p className='successMessage marginTop'>
            Email de recuperación enviado. Revisa tu bandeja de entrada.
          </p>
        )}
      </PopUp>
    </>
  )
}
