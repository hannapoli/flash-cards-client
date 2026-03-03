import { useState } from 'react';
import { Link, useLocation, useParams, useNavigate } from 'react-router';
import { auth } from '../../firebase/firebaseConfig';

export const AdminWordsCreate = () => {

  const location = useLocation();
  const { category, language, language_id } = location.state || {};
  const { category_id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    word: '',
    definition: '',
    transcription: '',
    example: '',
    category_id: '',
    image: null
  });

  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState(false);
  const [createSuccess, setCreateSuccess] = useState('');

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setFormData({
        ...formData,
        image: files[0] // guardamos el archivo
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    setCreateError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError(null);
    setCreateSuccess('');
    
    try {
      const token = await auth.currentUser?.getIdToken();

      // Creamos FormData para multipart/form-data
      const formDataToSend = new FormData();
      formDataToSend.append('word', formData.word);
      formDataToSend.append('definition', formData.definition);
      formDataToSend.append('transcription', formData.transcription);
      formDataToSend.append('example', formData.example);
      formDataToSend.append('category_id', category_id);
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await fetch(
        `${backendUrl}/admin/words`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          //El navegador establecerá content-Type con el boundary
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear la palabra');
      }

      const data = await response.json();
      setCreateSuccess('Palabra creada correctamente.');
      setTimeout(() => {
        navigate(`/admin/words/${category_id}`, { state: { category, category_id, language, language_id }})
      }, 2000);
      
      setFormData({
        word: '',
        definition: '',
        transcription: '',
        example: '',
        category_id: '',
        image: null
      });
    } catch (error) {
      setCreateError(error.message || 'Error al crear la palabra');
    } finally {
      setCreateLoading(false);
    }
  };
  
  return (
    <>
      <article className='flexColumn centeredContent'>
      <h1>Gestión de palabras</h1>
        <h2>Añadir nueva palabra</h2>
        <p className='group'>Categoría seleccionada: {category?.category}</p>

        {createSuccess && <p className='successMessage'>{createSuccess}</p>}
        {createError && <p className='errorMessage'>{createError}</p>}

        <form onSubmit={handleSubmit} className='flexColumn centeredContent'>
          <div className='flexColumn'>
            <label htmlFor='word'>Palabra:</label>
            <input
              type='text'
              name='word'
              id='word'
              placeholder={`e.g. "Gato"`}
              value={formData.word}
              onChange={handleChange}
              noValidate
            />
          </div>

           <div className='flexColumn'>
            <label htmlFor='definition'>Definición:</label>
            <input
              type='text'
              name='definition'
              id='definition'
              placeholder='Define la palabra...'
              value={formData.definition}
              onChange={handleChange}
              noValidate
            />
          </div>

           <div className='flexColumn'>
            <label htmlFor='transcription'>Transcripción:</label>
            <input
              type='text'
              name='transcription'
              id='transcription'
              placeholder='Transcribe la palabra...'
              value={formData.transcription}
              onChange={handleChange}
              noValidate
            />
          </div>

           <div className='flexColumn'>
            <label htmlFor='example'>Ejemplo:</label>
            <input
              type='text'
              name='example'
              id='example'
              placeholder='Pon el ejemplo aquí...'
              value={formData.example}
              onChange={handleChange}
              noValidate
            />
          </div>

          <div>
            <label htmlFor='image' className='labelUpload'>Subir imagen</label>
            <input 
              type='file' 
              id='image' 
              name='image' 
              accept='image/*'
              onChange={handleChange}
              noValidate
            />
          </div>
          
          <button type='submit' disabled={createLoading} className='confirmBtn marginTop'>
            {createLoading ? 'Creando...' : 'Crear palabra'}
          </button>
        </form>
        <Link to={`/admin/words/${category_id}`} state={{ category, category_id, language, language_id }}>
          <button className='confirmBtn'>Volver a palabras</button>
        </Link>
      </article>
    </>
  )
}