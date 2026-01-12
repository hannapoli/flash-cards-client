import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router';
import { auth } from '../../firebase/firebaseConfig';
import { useFetch } from '../../hooks/useFetch';
import { DeletePopUp } from '../../components/DeletePopUp';
import { ItemList } from '../../components/ItemList';

export const AdminWords = () => {
  const location = useLocation();
  const { category, language_id, language } = location.state || {};
  const { category_id } = useParams();

  const [words, setWords] = useState([]);
  const [error, setError] = useState(null);
  const [wordToDelete, setWordToDelete] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState('');

  const { fetchData, loading } = useFetch();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Mostrar palabras de la categoría que recibimos por params
  useEffect(() => {
    const loadWords = async () => {
      try {
        setError(null);
        const token = await auth.currentUser?.getIdToken();
        const response = await fetchData(
          `${backendUrl}/admin/word/getall/${category_id}`,
          'GET',
          null,
          token
        );
        // console.log(response);
        setWords(response.words || []);
      } catch (err) {
        setError(err.message || 'Error al cargar palabras');
      }
    };
    if (category_id) {
      loadWords();
    }
  }, [category_id, backendUrl, fetchData]);

  const handleDeleteWord = async () => {
    setDeleteLoading(true);
    setError(null);
    setDeleteSuccess('');
    try {
      const token = await auth.currentUser?.getIdToken();
      await fetchData(
        `${backendUrl}/admin/word/delete/${wordToDelete.id_word}`,
        'DELETE',
        null,
        token
      );
      setWords(words.filter(word => word.id_word !== wordToDelete.id_word));
      setShowDeletePopup(false);
      setWordToDelete(null);
      setDeleteSuccess('Palabra eliminada correctamente.');
    } catch (err) {
      setError(err.message || 'Error al eliminar la palabra');
    } finally {
      setDeleteLoading(false);
    }
  };

  const openDeletePopup = (word) => {
    setWordToDelete(word);
    setShowDeletePopup(true);
  };

  return (
    <>
      <section className='flexColumn'>
        <div className='flexColumn centeredContent'>
          <h1>Gestión de palabras </h1>
          <h2>{category && `${category.category}`}</h2>
          <p>Aquí puedes gestionar las palabras disponibles para esta categoría.</p>
          <Link to={`/admin/words/create/${category_id}`} state={{ category_id, category, language, language_id }}>
            <button className='confirmBtn marginTop longBtn'>Crear nueva palabra</button>
          </Link>
          <Link to={`/admin/categories/${language_id}`} state={{ language, language_id }}>
            <button className='confirmBtn longBtn'>Volver a categorías</button>
          </Link>
        </div>
        {loading && <p>Cargando palabras...</p>}
        {deleteSuccess && <p className='successMessage'>{deleteSuccess}</p>}
        {error && <p className='errorMessage'>{error}</p>}

          {words.length === 0 && !loading && <p className='marginTop'>No hay palabras disponibles para esta categoría.</p>}
        <section className='itemList'>
          {words.map((word) => (
            <ItemList
              key={word.id_word}
              itemObject={word}
              itemName={word.word}
              stateObject={{ word: word, category, category_id, language, language_id }}
              onMainPath={`/admin/card/${word.id_word}`}
              onModifyPath={`/admin/words/modify/${word.id_word}`}
              onDelete={openDeletePopup}
            />
          ))}
        </section>
      </section>

      {/* Popup para eliminar palabra */}
      {showDeletePopup && wordToDelete && (
        <DeletePopUp
          type='esta palabra'
          item={wordToDelete.word}
          onConfirm={handleDeleteWord}
          onCancel={() => setShowDeletePopup(false)}
          loading={deleteLoading}
          error={error}
        />
      )}
    </>
  );
}
