import { useEffect, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router';
import { auth } from '../../firebase/firebaseConfig';
import { useFetch } from '../../hooks/useFetch';

export const UserWords = () => {
  const { language_id, category_id } = useParams();
  const location = useLocation();
  const language = location.state?.language;
  const category = location.state?.category;

  const [words, setWords] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const { fetchData, loading } = useFetch();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (category_id) {
      loadWords();
    }
  }, [category_id, backendUrl, fetchData]);

  const loadWords = async () => {
    try {
      setError(null);
      const token = await auth.currentUser?.getIdToken();
      const response = await fetchData(
        `${backendUrl}/user/categories/${category_id}/words`,
        'GET',
        null,
        token
      );
      setWords(response.words || []);
    } catch (err) {
      setError(err.message || 'Error al cargar palabras');
    }
  };

  const handleAddWord = async (word) => {
    try {
      setError(null);
      const token = await auth.currentUser?.getIdToken();
      await fetchData(
        `${backendUrl}/user/words`,
        'POST',
        { word_id: word.id_word },
        token
      );
      setSuccessMessage('Palabra añadida a tu colección');
      setTimeout(() => setSuccessMessage(''), 2000);
      await loadWords();
    } catch (err) {
      setError(err.message || 'Error al añadir palabra');
    }
  };

  const handleRemoveWord = async (word) => {
    try {
      setError(null);
      const token = await auth.currentUser?.getIdToken();
      await fetchData(
        `${backendUrl}/user/words/${word.id_word}`,
        'DELETE',
        null,
        token
      );
      setSuccessMessage('Palabra eliminada de tu colección');
      setTimeout(() => setSuccessMessage(''), 2000);
      await loadWords();
    } catch (err) {
      setError(err.message || 'Error al eliminar palabra');
    }
  };

  const handleMarkAsLearned = async (word) => {
    try {
      setError(null);
      const token = await auth.currentUser?.getIdToken();
      await fetchData(
        `${backendUrl}/user/words/${word.id_word}/learned`,
        'PATCH',
        null,
        token
      );
      setSuccessMessage('¡Palabra marcada como aprendida!');
      setTimeout(() => setSuccessMessage(''), 2000);
      await loadWords();
    } catch (err) {
      setError(err.message || 'Error al marcar como aprendida');
    }
  };

  const savedWords = words.filter(w => w.status === 'saved');
  const learnedWords = words.filter(w => w.status === 'learned');
  const availableWords = words.filter(w => !w.status);

  return (
    <>
      <section className='flexColumn'>
        <div className='flexColumn centeredContent'>
          <h1>{category?.category || 'Palabras'}</h1>
          <p>Añade palabras a tu colección y márcalas como aprendidas.</p>
          <Link to={`/user/lang/${language_id}/categories`} state={{ language }}>
            <button className='marginTop'>Volver a categorías</button>
          </Link>
        </div>
        {loading && <p>Cargando palabras...</p>}
        {successMessage && <p className='successMessage'>{successMessage}</p>}
        {error && <p className='errorMessage'>{error}</p>}

        {savedWords.length > 0 && (
          <>
            <h2 className='marginTop'>Mi colección:</h2>
            <section className='itemList'>
              {savedWords.map((word) => (
                <article key={word.id_word} className='item flexColumn'>
                  <Link to={`/user/lang/${language_id}/categories/${category_id}/words/${word.id_word}`}
                    state={{ word, category, language }}>
                    <button className='itemBtn'>{word.word} ⭐️</button>
                  </Link>
                  <div className='itemActions flexContainer'>
                    <button onClick={() => handleMarkAsLearned(word)} className='confirmBtn'>Mover a aprendidas ✔️</button>
                    <button onClick={() => handleRemoveWord(word)} className='deleteBtn'>Eliminar</button>
                  </div>
                </article>
              ))}
            </section>
          </>
        )}

        {learnedWords.length > 0 && (
          <>
            <h2 className='marginTop'>Palabras aprendidas:</h2>
            <section className='itemList'>
              {learnedWords.map((word) => (
                <article key={word.id_word} className='item flexColumn'>
                  <Link to={`/user/lang/${language_id}/categories/${category_id}/words/${word.id_word}`}
                    state={{ word, category, language }}>
                    <button className='itemBtn'>{word.word} ✔️</button>
                  </Link>
                  <div className='itemActions flexContainer'>
                    <button onClick={() => handleRemoveWord(word)} className='deleteBtn'>Eliminar</button>
                  </div>
                </article>
              ))}
            </section>
          </>
        )}

        {availableWords.length > 0 && (
          <>
            <h2 className='marginTop'>Palabras disponibles:</h2>
            <section className='itemList'>
              {availableWords.map((word) => (
                <article key={word.id_word} className='item flexColumn'>
                  <Link to={`/user/lang/${language_id}/categories/${category_id}/words/${word.id_word}`}
                    state={{ word, category, language }}>
                    <button className='itemBtn'>{word.word}</button>
                  </Link>
                  <div className='itemActions flexContainer'>
                    <button onClick={() => handleAddWord(word)} className='confirmBtn'>Añadir ➕</button>
                  </div>
                </article>
              ))}
            </section>
          </>
        )}

        {words.length === 0 && !loading && <p className='marginTop'>No hay palabras en esta categoría.</p>}
      </section>
    </>
  )
}
