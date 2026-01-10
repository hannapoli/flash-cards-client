import { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router';
import { auth } from '../../firebase/firebaseConfig';

export const AdminWordsModify = () => {
  const location = useLocation();
  const { word, category, category_id, language, language_id } = location.state || {};
  const { word_id } = useParams();

  const [formData, setFormData] = useState({
    word: word?.word || '',
    definition: word?.definition || '',
    transcription: word?.transcription || '',
    example: word?.example || '',
    category_id: category_id || '',
    image: word?.image || null
  });

  const [modifyLoading, setModifyLoading] = useState(false);
  const [modifyError, setModifyError] = useState(null);
  const [modifySuccess, setModifySuccess] = useState('');

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
    setModifyError(null);
  };

  const handleModifyCategory = async (e) => {
    e.preventDefault();
    setModifyLoading(true);
    setModifyError(null);
    setModifySuccess('');
    try {
      if (!word) {
        setModifyError('No se ha encontrado la palabra.');
        return;
      }
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
        `${backendUrl}/admin/word/edit/${word_id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al modificar la palabra');
      }

      const data = await response.json();
      setModifySuccess('Palabra modificada correctamente.');

      setFormData({
        word: data?.word.word || '',
        definition: data?.word.definition || '',
        transcription: data?.word.transcription || '',
        example: data?.word.example || '',
        category_id: data?.word.category_id || '',
        image: data?.image || null
      });
    } catch (error) {
      setModifyError(error.message || 'Error al modificar la palabra.');
    } finally {
      setModifyLoading(false);
    }
  };

  return (
    <>
      <h1>Gestión de palabras</h1>
      <article className='flexColumn centeredContent'>
        <h2>Modificar palabra</h2>
        <p className='group'>Categoría seleccionada: {category?.category}</p>

        {modifySuccess && <p className='successMessage'>{modifySuccess}</p>}
        {modifyError && <p className='errorMessage'>{modifyError}</p>}
        <form onSubmit={handleModifyCategory} className='flexColumn centeredContent'>
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

          <button type='submit' disabled={modifyLoading} className='confirmBtn marginTop'>
            {modifyLoading ? 'Modificando...' : 'Modificar palabra'}
          </button>
        </form>
        <Link to={`/admin/words/${category_id}`} state={{ category, category_id, language, language_id }}>
          <button className='confirmBtn'>Volver a palabras</button>
        </Link>
      </article>
    </>
  )
};