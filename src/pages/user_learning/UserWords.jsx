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
  const [search, setSearch] = useState('');
  const [foundWord, setFoundWord] = useState(null);
  const [searchError, setSearchError] = useState('');

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
        `${backendUrl}/user/progress/categories/${category_id}`,
        'GET',
        null,
        token
      );
      setProgressPercentage(progressResult?.progressPercentage ?? 0);
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

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchError('');
    setFoundWord(null);
    
    if (!search.trim()) {
      setSearchError('Por favor, escribe una palabra para buscar');
      return;
    }

    const searchTerm = search.toLowerCase().trim();
    const found = words.find(w => w.word.toLowerCase() === searchTerm);
    
    if (found) {
      setFoundWord(found);
    } else {
      setSearchError(`No se encontró la palabra "${search}"`);
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
              <form className='flexContainer centeredContent marginTop' onSubmit={handleSearch}>
                <div className='flexColumn'>
                  <input
                    type="text"
                    placeholder="Buscar palabras..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    noValidate
                    className='searchInput'
                  />
                </div>
                <div>
                  <button type='submit' className='searchBtn '>
                    Buscar
                  </button>
                </div>
              </form>
              {searchError && <p className='errorMessage marginTop'>{searchError}</p>}
              {foundWord && (
                <div className='foundWord flexColumn centeredContent marginTop'>
                  <h3>Palabra encontrada:</h3>
                  <Link to={`/user/lang/${language_id}/categories/${category_id}/words/${foundWord.id_word}`}
                    state={{ word: foundWord, category, language }}>
                    <button className='labelUpload bigBtn longBtn'>
                      {foundWord.word} {foundWord.status === 'saved' ? '⭐️' : foundWord.status === 'learned' ? '✔️' : ''}
                    </button>
                  </Link>
                  <p>Estado: {foundWord.status === 'saved' ? 'En tu colección' : foundWord.status === 'learned' ? 'Aprendida' : 'Disponible'}</p>
                </div>
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
            <p>¡Enhorabuena! Has aprendido todas estas palabras.</p>

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
      </section >
    </>
  )
}
