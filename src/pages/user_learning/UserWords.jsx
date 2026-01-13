import { useEffect, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router';
import { auth } from '../../firebase/firebaseConfig';
import { useFetch } from '../../hooks/useFetch';
import { ProgressComponent } from '../../components/ProgressComponent';

export const UserWords = () => {
  const { language_id, category_id } = useParams();
  const location = useLocation();
  const language = location.state?.language;
  const category = location.state?.category;
  const progress = location.state?.progressPercentage ?? 0;

  const [words, setWords] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [progressPercentage, setProgressPercentage] = useState(progress);

  const { fetchData, loading } = useFetch();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (category_id) {
      loadWordsAndProgress();
    }
  }, [category_id, backendUrl, fetchData]);

  const loadWordsAndProgress = async () => {
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

      const progressResult = await fetchData(
        `${backendUrl}/user/progress/languages/${language_id}/categories`,
        'GET',
        null,
        token
      );
      const categoryProgress = (progressResult.progress || []).find(cat => cat.id_category === Number(category_id));
      setProgressPercentage(categoryProgress?.progressPercentage ?? 0);
    } catch (err) {
      setError('Error al cargar palabras');
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
      await loadWordsAndProgress();
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
      await loadWordsAndProgress();
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
      await loadWordsAndProgress();
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
          <ProgressComponent
            percentage={progressPercentage}
            wordPage={true}
            pathColor={'var(--color-dark)'}
            trailColor={'#fcb3aa'}
            textColor={'var(--color-darker)'}
            textSize={'2.2rem'}
          />
          {progressPercentage !== 100 && (
            <p>Añade palabras a tu colección y márcalas como aprendidas.</p>
          )}
          <Link to={`/user/lang/${language_id}/categories`} state={{ language }}>
            <button className='marginTop'>Volver a categorías</button>
          </Link>
        </div>
        {loading && <p>Cargando palabras...</p>}
        {words.length === 0 && !loading && <p className='marginTop'>Todavía no hay palabras en esta categoría.</p>}
        {successMessage && <p className='successMessage'>{successMessage}</p>}
        {error && <p className='errorMessage'>{error}</p>}

        {savedWords.length > 0 && (
          <article>
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
                    <button onClick={() => handleRemoveWord(word)} className='deleteBtn'>Eliminar 🗑️</button>
                  </div>
                </article>
              ))}
            </section>
          </article>
        )}

        {availableWords.length > 0 && (
          <article>
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
          </article>
        )}

        {learnedWords.length > 0 && (
          <article>
            <h2 className='marginTop'>Palabras aprendidas:</h2>
            <p>¡Enhorabuena! Has aprendido todas estas palabras!.</p>

            <section className='itemList'>
              {learnedWords.map((word) => (
                <article key={word.id_word} className='item flexColumn'>
                  <Link to={`/user/lang/${language_id}/categories/${category_id}/words/${word.id_word}`}
                    state={{ word, category, language }}>
                    <button className='itemBtn'>{word.word} ✔️</button>
                  </Link>
                  <div className='itemActions flexContainer'>
                    <button onClick={() => handleRemoveWord(word)} className='deleteBtn'>Eliminar 🗑️</button>
                  </div>
                </article>
              ))}
            </section>
          </article>
        )}
      </section>
    </>
  )
}
