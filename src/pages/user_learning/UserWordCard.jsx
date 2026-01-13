import { useEffect, useState } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router';
import { auth } from '../../firebase/firebaseConfig';
import { useFetch } from '../../hooks/useFetch';
import { WordCard } from '../../components/WordCard';

export const UserWordCard = () => {
  const { language_id, category_id, word_id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const category = location.state?.category;
  const language = location.state?.language;

  const [wordData, setWordData] = useState({
    id_word: null,
    word: '',
    definition: '',
    transcription: '',
    example: '',
    category_id: '',
    image: null
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isRevealed, setIsRevealed] = useState(false);
  const [savedWords, setSavedWords] = useState([]);

  //Mostrar y esconder la tarjeta de la palabra
  const toggleReveal = () => {
    setIsRevealed(!isRevealed);
  };

  const { fetchData, loading } = useFetch();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (category_id) {
      loadSavedWords();
    }
  }, [category_id, backendUrl, fetchData]);

  useEffect(() => {
    if (word_id) {
      loadWordCard();
    }
  }, [word_id, backendUrl, fetchData]);

  const loadSavedWords = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await fetchData(
        `${backendUrl}/user/categories/${category_id}/words`,
        'GET',
        null,
        token
      );
      const allWords = response.words || [];
      const saved = allWords.filter(w => w.status === 'saved');
      setSavedWords(saved);
    } catch (err) {
      console.error('Error loading saved words:', err);
    }
  };

  const loadWordCard = async () => {
    try {
      setError(null);
      const token = await auth.currentUser?.getIdToken();
      const response = await fetchData(
        `${backendUrl}/user/words/${word_id}/card`,
        'GET',
        null,
        token
      );
      const wordInfo = response.wordCard;
      // console.log(wordInfo);
      setWordData({
        id_word: wordInfo?.id_word || null,
        word: wordInfo?.word || '',
        definition: wordInfo?.definition || '',
        transcription: wordInfo?.transcription || '',
        example: wordInfo?.example || '',
        category_id: wordInfo?.category_id || '',
        image_url: response?.img_url || null,
        status: wordInfo?.status || null
      });
    } catch (err) {
      setError(err.message || 'Error al cargar palabra');
    }
  };

  const handleAddWord = async () => {
    try {
      setError(null);
      const token = await auth.currentUser?.getIdToken();
      await fetchData(
        `${backendUrl}/user/words`,
        'POST',
        { word_id: wordData.id_word },
        token
      );
      setSuccessMessage('Palabra añadida a tu colección');
      setTimeout(() => setSuccessMessage(''), 2000);
      await loadWordCard();
    } catch (err) {
      setError(err.message || 'Error al añadir palabra');
    }
  };

  const handleRemoveWord = async () => {
    try {
      setError(null);
      const token = await auth.currentUser?.getIdToken();
      await fetchData(
        `${backendUrl}/user/words/${wordData.id_word}`,
        'DELETE',
        null,
        token
      );
      setSuccessMessage('Palabra eliminada de tu colección');
      setTimeout(() => {
        navigate(`/user/lang/${language_id}/categories/${category_id}/words`,
          { state: { category, language } });
      }, 1500);
    } catch (err) {
      setError(err.message || 'Error al eliminar palabra');
    }
  };

  const handleMarkAsLearned = async () => {
    try {
      setError(null);
      const token = await auth.currentUser?.getIdToken();
      await fetchData(
        `${backendUrl}/user/words/${wordData.id_word}/learned`,
        'PATCH',
        null,
        token
      );
      // console.log(wordData.id_word)
      setSuccessMessage('¡Palabra marcada como aprendida!');
      setTimeout(() => setSuccessMessage(''), 2000);
      await loadWordCard();
      await loadSavedWords();
    } catch (err) {
      setError(err.message || 'Error al marcar como aprendida');
    }
  };

  const handleNextWord = () => {
    if (savedWords.length === 0) return;

    const otherWords = savedWords.filter(w => w.id_word !== parseInt(word_id));
    if (otherWords.length === 0) return;

    const randomIndex = Math.floor(Math.random() * otherWords.length);
    const nextWord = otherWords[randomIndex];
    setIsRevealed(false);
    navigate(`/user/lang/${language_id}/categories/${category_id}/words/${nextWord.id_word}`,
      { state: { word: nextWord, category, language } });
  };

  return (
    <>
      <section className='flexColumn centeredContent'>
        {loading && <p>Cargando palabra...</p>}
        {successMessage && <p className='successMessage'>{successMessage}</p>}
        {error && <p className='errorMessage'>{error}</p>}

        {wordData && (
          <>


            <WordCard
              word={wordData.word}
              definition={wordData.definition}
              transcription={wordData.transcription}
              example={wordData.example}
              image_filename={wordData.image_filename}
              image_url={wordData.image_url}
              category_id={wordData.category_id}
              status={wordData.status}
              isRevealed={isRevealed}
              onToggleReveal={toggleReveal}
            />

            <div className='btns centeredContent marginBottom'>
              {!wordData.status && (
                <button onClick={handleAddWord} className='confirmBtn smallBtn'>
                  ➕
                </button>
              )}

              {wordData.status === 'saved' && (
                <>
                  <button onClick={handleMarkAsLearned} className='confirmBtn smallBtn'>
                    ✔️
                  </button>
                  <button onClick={handleRemoveWord} className='deleteBtn smallBtn'>
                    🗑️
                  </button>
                </>
              )}

              {wordData.status === 'learned' && (
                <>
                  <div>
                    <p className='successMessage longBtn'>¡Palabra aprendida! ✔️</p>
                  </div>
                  <button onClick={handleRemoveWord} className='deleteBtn smallBtn'>
                    🗑️
                  </button>
                </>
              )}

              {wordData.status === 'saved' && savedWords.length > 1 && (
                <button onClick={handleNextWord} className='confirmBtn smallBtn'>
                  ➡️
                </button>
              )}
            </div>
          </>
        )}
        <Link to={`/user/lang/${language_id}/categories/${category_id}/words`}
          state={{ category, language }}>
          <button className='marginTop longBtn'>Volver a palabras</button>
        </Link>
      </section>
    </>
  )
}
