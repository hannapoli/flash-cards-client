import { useState } from 'react';
import { Link, useLocation, useParams, useNavigate } from 'react-router';
import { useFetch } from '../../hooks/useFetch';
import { auth } from '../../firebase/firebaseConfig';

export const AdminCategoriesCreate = () => {
  const location = useLocation();
  const { language } = location.state || {};
  const { language_id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    category: '',
    language_id: language_id
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState(false);
  const [createSuccess, setCreateSuccess] = useState('');

  const { fetchData, loading } = useFetch();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setCreateError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError(null);
    setCreateSuccess('');
    try {
      const token = await auth.currentUser?.getIdToken();

      const payload = {
        category: formData.category,
        language_id: language_id
      };
      await fetchData(
        `${backendUrl}/admin/categories`,
        'POST',
        payload,
        token
      );
      setCreateSuccess('Categoría creada correctamente.');
      setTimeout(() => {
        navigate(`/admin/categories/${language_id}`, { state: { language, language_id }})
      }, 2000);
    } catch (error) {
      setCreateError(error.message || 'Error al crear la categoría');
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <>
      <article className='flexColumn centeredContent'>
      <h1>Gestión de categorías</h1>
        <h2>Añadir nueva categoría</h2>
        <p className='group'>Idioma seleccionado: {language?.language}</p>

        {createSuccess && <p className='successMessage'>{createSuccess}</p>}
        {createError && <p className='errorMessage'>{createError}</p>}

        <form onSubmit={handleSubmit} className='flexColumn centeredContent'>
          <div className='flexColumn'>
            <label htmlFor='category'>Categoría:</label>
            <input
              type='text'
              name='category'
              id='category'
              placeholder={`e.g. "Comida"`}
              value={formData.category}
              onChange={handleChange}
              noValidate
            />
          </div>
          <button type='submit' disabled={createLoading} className='confirmBtn marginTop'>
            {createLoading ? 'Creando...' : 'Crear categoría'}
          </button>
        </form>
        <Link to={`/admin/categories/${language_id}`} state={{ language, language_id }}>
          <button className='confirmBtn'>Volver a categorías</button>
        </Link>
      </article>
    </>
  )
}
