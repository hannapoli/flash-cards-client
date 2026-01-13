import { useEffect, useState } from 'react';
import { Link, useLocation, useParams, useNavigate } from 'react-router';
import { auth } from '../../firebase/firebaseConfig';
import { useFetch } from '../../hooks/useFetch';
import { DeletePopUp } from '../../components/DeletePopUp';
import { WordCard } from '../../components/WordCard'

export const AdminCard = () => {
  const location = useLocation();
  const { word, category, category_id, language, language_id } = location.state || {};
  const { word_id } = useParams();
  const navigate = useNavigate();

  const [wordData, setWordData] = useState({
    word: '',
    definition: '',
    transcription: '',
    example: '',
    category_id: '',
    image: null
  });
  const [error, setError] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState('');

  const { fetchData, loading } = useFetch();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Mostrar palabras de la categoría que recibimos por params
  useEffect(() => {
    const loadCard = async () => {
      try {
        setError(null);
        const token = await auth.currentUser?.getIdToken();
        const response = await fetchData(
          `${backendUrl}/admin/word/get/${word_id}`,
          'GET',
          null,
          token
        );
        // console.log({response});
        const wordInfo = response.word;
        setWordData({
          word: wordInfo.word || '',
          definition: wordInfo.definition || '',
          transcription: wordInfo.transcription || '',
          example: wordInfo.example || '',
          category_id: wordInfo.category_id || '',
          image_url: response.img_url || null
        });
      } catch (err) {
        setError(err.message || 'Error al cargar la palabra');
      }
    };
    if (word_id) {
      loadCard();
    }
  }, [word_id, backendUrl, fetchData]);

  // console.log({wordData});

  const handleDeleteWord = async () => {
    setDeleteLoading(true);
    setError(null);
    setDeleteSuccess('');
    try {
      const token = await auth.currentUser?.getIdToken();
      await fetchData(
        `${backendUrl}/admin/word/delete/${word_id}`,
        'DELETE',
        null,
        token
      );
      setShowDeletePopup(false);
      setDeleteSuccess('Palabra eliminada correctamente.');
      setTimeout(() => {
        navigate(`/admin/words/${category_id}`, { state: { category, category_id, language, language_id } })
      }, 2000);
    } catch (err) {
      setError(err.message || 'Error al eliminar la palabra');
    } finally {
      setDeleteLoading(false);
    }
  };

  const openDeletePopup = () => setShowDeletePopup(true);

  return (
    <>
      <section className='flexColumn'>
        {loading && <p>Cargando la palabra...</p>}
        {deleteSuccess && <p className='successMessage'>{deleteSuccess}</p>}
        {error && <p className='errorMessage'>{error}</p>}

        <WordCard
          word={wordData.word}
          definition={wordData.definition}
          transcription={wordData.transcription}
          example={wordData.example}
          image_filename={wordData.image_filename}
          image_url={wordData.image_url}
          category_id={wordData.category_id}
        />
        <div className='flexColumn centeredContent marginTop'>
          <div>
            <Link to={`/admin/words/modify/${word_id}`} state={{ word: word, category, category_id, language, language_id }}>
              <button>Modificar la palabra</button>
            </Link>

            <button onClick={openDeletePopup} className='deleteBtn'>Eliminar la palabra</button>
          </div>

          <div>
            <Link to={`/admin/words/${category_id}`} state={{ category, category_id, language, language_id }}>
              <button className='confirmBtn marginTop'>Volver a palabras</button>
            </Link>
          </div>
        </div>
      </section>

      {/* Popup para eliminar palabra */}
      {showDeletePopup && wordData.word && (
        <DeletePopUp
          type='esta palabra'
          item={wordData.word}
          onConfirm={handleDeleteWord}
          onCancel={() => setShowDeletePopup(false)}
          loading={deleteLoading}
          error={error}
        />
      )}
    </>
  )
}
